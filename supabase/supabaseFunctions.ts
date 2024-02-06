import { SupabaseClient } from "@supabase/supabase-js";
import { sendMoney } from "../thirdweb/ContractMutations";
import { checkOrder } from "../utils/utils";
import { v4 as uuidv4 } from "uuid";



export const getSupabaseUser = async (
  supabase: SupabaseClient,
  address: string
) => {
  try {
    const user = await supabase
      .from("users")
      .select("*")
      .eq("address", address)
      .single();

    return user.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const saveTwitterInfoInSupabase = async (
  supabase: SupabaseClient,
  address: string,
  twitterId: string,
  twitterHandle: string,
  twitterName: string,
  avatarUrl: string
) => {
  try {
    const { data, error } = await supabase
      .from("users")
      .update({
        twitter_id: twitterId,
        twitter_handle: twitterHandle,
        twitter_name: twitterName,
        address: address,
        avatar_url: avatarUrl,
      })
      .eq("address", address)
      .select("*");

    if (error) {
      console.error("this is error", error);
      throw error;
    }

    console.log("data", data);

    return data;
  } catch (error) {
    console.error("this is error", error);
    throw error;
  }
};

// export const getUsersWithPagination = async (
//   supabase: any,
//   address: string
// ) => {
//   try {
//     const { data, error } = await supabase
//       .from("users")
//       .select("*")
//       .neq("address", address)
//       .limit(3);

//     if (error) {
//       console.error("this is error", error);
//       throw error;
//     }

//     console.log("data", data);

//     return data;
//   } catch (error) {
//     console.error("Error getting users:", error);
//     throw error;
//   }
// };

// export const getUsersWithPagination = async (supabase, address, searchTerm) => {
//   let query = supabase
//     .from('users')
//     .select('*')
//     .neq("address", address);

//   // Add partial word search filter
//   if (searchTerm && searchTerm.trim() !== '') {
//     // Modify 'twitter_handle' and 'twitter_name' to the columns you want to search in
//     query = query
//       .or(`twitter_handle.ilike.%${searchTerm}%,twitter_name.ilike.%${searchTerm}%`);
//   }

//   const { data, error } = await query;
//   if (error) {
//     console.error('Error fetching users:', error);
//     return [];
//   }
//   return data;
// };
export const getUsersWithPagination = async (supabase, address, searchTerm) => {
  let query = supabase
    .from("users")
    .select("*, fts") // Temporarily select the fts column for debugging
    .neq("address", address);

  if (searchTerm && searchTerm.trim() !== "") {
    const formattedSearchTerm = searchTerm
      .trim()
      .split(/\s+/)
      .map((word) => `${word}:*`)
      .join(" & ");
    query = query.textSearch("fts", formattedSearchTerm);
  }

  const { data, error } = await query;
  if (error) {
    console.error("Error fetching users:", error);
    return [];
  }
  return data;
};

export const sendMessage = async (
  supabase: SupabaseClient,
  userId: string,
  recipientId: string,
  message: string,
  weiValue: number,
  mutateAsync: any,
  refetch: any,
  appendMsg: any,
  updateMsg: any
) => {
  const order = checkOrder(userId, recipientId);
  const chatRoomId = "chat_" + order[0] + "_" + order[1];
  const messageId = uuidv4(); // Unique identifier for the message

  // Step 1: Insert the message into local state as 'pending'

  // setChat((prevMessages) => [...prevMessages, newMessage]);
  appendMsg({
    _id: messageId,
    type: "text",
    content: { text: message },
    position: "right",
    status: "loading",
  });

  appendMsg({
    _id: "transaction_" + messageId,
    type: "text",
    content: { text: "Pending Transaction..." },
    position: "right",
    status: "loading",
  });

  try {
    // Step 2: Update or create chat room
    let { data: chatRoomData, error: chatRoomError } = await supabase
      .from("chat_rooms")
      .upsert({
        id: chatRoomId,
        participants: [userId, recipientId],
        last_message: message,
        last_message_timestamp: "NOW()",
      });

    if (chatRoomError) throw chatRoomError;

    // Step 3: Send user message to Supabase
    // let { error: messageError } = await supabase.from("messages").insert({
    //   id: messageId,
    //   sender: userId,
    //   recipient: recipientId,
    //   message: message,
    //   chat_room_id: chatRoomId,
    // });

    // if (messageError) throw messageError;

    let { data: responseBucketId, error: messageError } = await supabase.rpc(
      "send_message",
      {
        _sender: userId,
        _recipient: recipientId,
        _message_id: messageId,
        _message: message,
        _chat_room_id: chatRoomId,
      }
    );

    if (messageError) throw messageError;

    // Handle the sending of money
    sendMoney(
      mutateAsync,
      weiValue,
      messageId,
      responseBucketId,
      userId,
      recipientId
    );
    
    refetch();

    // Step 4: Update the message status to 'confirmed' in the local state
    updateMsg(messageId, {
      _id: messageId,
      type: "text",
      content: { text: message },
      position: "right",
      status: "sent",
    });
  } catch (error) {
    console.error("An error occurred:", error);
    // Handle error
    // Optionally, you can update the status of the message to 'failed' in the local state
    updateMsg(messageId, {
      _id: messageId,
      type: "text",
      content: { text: message },
      position: "right",
      status: "failed",
    });

    updateMsg(messageId + "_transaction", {
      _id: "transaction_" + messageId,
      type: "text",
      content: { text: "Transaction Failed" },
      position: "right",
      status: "failed",
    });

    throw error;
  }
};



export const onChatMessagesSupabase = (
  supabase: SupabaseClient,
  chatRoomId: string,
  appendMsg: any,
  updateMsg: any,
  messagesRef: any,
  userId: string,
  formatTransactionMessage: any
) => {
  const channel = `chatRooms:${chatRoomId}`;

  const unsubscribe = supabase
    .channel(channel)
    .on(
      "postgres_changes",
      {
        event: "INSERT",
        schema: "public",
        table: "messages",
        filter: `chat_room_id=eq.${chatRoomId}`,
      },
      (payload) => {
        console.log("New message received!", payload.new);
        const message = payload.new;
        const existingMessageIndex = messagesRef.current.findIndex(
          (m) => m._id === message.id
        );

        if (existingMessageIndex !== -1) {
          // Update the existing message
          updateMsg(message.id, {
            ...messagesRef.current[existingMessageIndex],
            ...message,
            status: "confirmed",
          });
        } else {
          // New message, add to the list
          appendMsg({
            _id: message.id,
            type: "text",
            content: { text: message.message },
            position: message.sender === userId ? "right" : "left",
            status: "confirmed",
          });
          // Append a temporary "pending transaction" message if needed
          if (message.shouldHaveTransaction) {
            appendMsg({
              _id: "transaction_" + message.id,
              type: "text",
              content: { text: "Pending Transaction..." },
              position: message.sender === userId ? "right" : "left",
              status: "loading",
            });
          }
        }
      }
    )
    .on(
      "postgres_changes",
      { event: "INSERT", schema: "public", table: "transactions" },
      (payload) => {
        console.log("New transaction received!", payload.new);
        const transaction = payload.new;
        console.log(messagesRef.current);
        const associatedMessageIndex = messagesRef.current.findIndex(
          (m) => m._id === transaction.id
        );
        console.log("associatedMessageIndex", associatedMessageIndex);
        console.log(
          "messagesRef.current",
          messagesRef.current[associatedMessageIndex]
        );
        console.log("new", payload.new);
        if (associatedMessageIndex !== -1) {
          const confirmedTransactionMessage = formatTransactionMessage(
            payload.new,
            userId
          );
          updateMsg(transaction.id, confirmedTransactionMessage);
          // Update the message with transaction details
          // updateMsg(transaction.message_id, {
          //   ...messagesRef.current[associatedMessageIndex],
          //   transaction: transaction, // Add or update transaction details
          //   status: transaction.status || "confirmed",
          // });

          // // Optionally, remove the temporary "pending transaction" message
          // updateMsg(transaction.message_id + "_transaction", {
          //   _id: transaction.message_id + "_transaction",
          //   type: "custom",

          //   content: { text: "Transaction Confirmed" },
          //   position: messagesRef.current[associatedMessageIndex].sender === userId ? "right" : "left",
          //   status: "confirmed",
          // });
        }
      }
    )
    .subscribe();

  return unsubscribe;
};

export const getChatUserSupabase = async (
  supabase: SupabaseClient,
  address: string
) => {
  try {
    let { data, error, status } = await supabase
      .from("users") // Assuming the table is named 'users'
      .select("*")
      .eq("address", address)
      .single();

    if (error && status !== 406) {
      throw error;
    }

    return data;
  } catch (error) {
    console.error("Error getting user:", error);
    throw error;
  }
};

export const getMe = async (address: string, supabase: SupabaseClient) => {
  try {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("address", address)
      .single();

    if (error) {
      console.error("Error getting users:", error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error("Error getting users:", error);
    throw error;
  }
};

export const getMyChatRoomsSupabase = async (supabase, address) => {
  try {
    // Get chat rooms where user is a participant
    let { data: chatRooms, error: chatRoomsError } = await supabase
      .from("chat_rooms")
      .select("*")
      .contains("participants", [address]);

    console.log("chatRooms", chatRooms);

    if (chatRoomsError) throw chatRoomsError;

    // Process each chat room to get other participant's details and format message timestamps
    const chatRoomsWithUserDetails = await Promise.all(
      chatRooms.map(async (chatRoom) => {
        const otherParticipantAddress = chatRoom.participants.find(
          (p) => p !== address
        );

        // Get the other participant's user details
        let { data: userData, error: userError } = await supabase
          .from("users")
          .select("*")
          .eq("address", otherParticipantAddress)
          .single();

        if (userError) throw userError;

        // Format the timestamp
        const timestamp = new Date(chatRoom.last_message_timestamp);
        const formattedTimestamp =
          timestamp.getFullYear() +
          "-" +
          ("0" + (timestamp.getMonth() + 1)).slice(-2) +
          "-" +
          ("0" + timestamp.getDate()).slice(-2) +
          " " +
          ("0" + timestamp.getHours()).slice(-2) +
          ":" +
          ("0" + timestamp.getMinutes()).slice(-2);

        return {
          id: chatRoom.id,
          lastMessage: chatRoom.last_message,
          lastMessageTimestamp: formattedTimestamp,
          otherParticipant: {
            address: otherParticipantAddress,
            name: userData?.twitter_name,
            image: userData?.avatar_url,
            handle: userData?.twitter_handle,
          },
          // Add any other chat room details you need
        };
      })
    );

    return chatRoomsWithUserDetails;
  } catch (error) {
    console.error("Error getting chat rooms with user details:", error);
    throw error;
  }
};

export const fetchInitialMessages = async (
  supabase,
  chatRoomId,
  page,
  limit
) => {
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit - 1;

  const { data, error } = await supabase
    .from("messages")
    .select(
      `
      *,
      transactions (
        transaction_hash,
        wei_value
      )
    `
    )
    .eq("chat_room_id", chatRoomId)
    .order("created_at", { ascending: false })
    // Use correct range for descending order
    .range(startIndex, endIndex);

  console.log("data", data);

  if (error) {
    console.error("Error fetching initial messages: ", error);
    return [];
  } else {
    const formattedData = data.map((message) => {
      const transaction = message.transactions[0] || {};
      return { ...message, ...transaction };
    });
    return formattedData;
  }
};
