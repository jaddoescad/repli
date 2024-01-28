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
    .from('users')
    .select('*, fts') // Temporarily select the fts column for debugging
    .neq("address", address);

  if (searchTerm && searchTerm.trim() !== '') {
    const formattedSearchTerm = searchTerm.trim().split(/\s+/).map(word => `${word}:*`).join(' & ');
    query = query
      .textSearch('fts', formattedSearchTerm);
  }

  const { data, error } = await query;
  if (error) {
    console.error('Error fetching users:', error);
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
  setChat: React.Dispatch<React.SetStateAction<any[]>> // Add this parameter to update local state
) => {
  const order = checkOrder(userId, recipientId);
  const chatRoomId = "chat_" + order[0] + "_" + order[1];
  const messageId = uuidv4(); // Unique identifier for the message

  // Step 1: Insert the message into local state as 'pending'
  const newMessage = {
    id: messageId,
    sender: userId,
    recipient: recipientId,
    message: message,
    chat_room_id: chatRoomId,
    status: 'pending', // Initial status
    created_at: new Date().toISOString(),
  };

  setChat((prevMessages) => [...prevMessages, newMessage]);

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
    let { error: messageError } = await supabase.from("messages").insert({
      id: messageId,
      sender: userId,
      recipient: recipientId,
      message: message,
      chat_room_id: chatRoomId,
    });

    if (messageError) throw messageError;

    // Handle the sending of money
    sendMoney(mutateAsync, weiValue, messageId, userId, recipientId);
    refetch();

    // Step 4: Update the message status to 'confirmed' in the local state
    setChat((prevMessages) =>
      prevMessages.map((msg) =>
        msg.id === messageId ? { ...msg, status: 'confirmed' } : msg
      )
    );
  } catch (error) {
    console.error("An error occurred:", error);
    // Handle error
    // Optionally, you can update the status of the message to 'failed' in the local state
    setChat((prevMessages) =>
      prevMessages.map((msg) =>
        msg.id === messageId ? { ...msg, status: 'failed' } : msg
      )
    );
    throw error;
  }
};


export const onChatMessagesSupabase = (
  supabase: SupabaseClient,
  chatRoomId: string,
  callback: (messages: []) => void
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
        if (payload.new.chat_room_id === chatRoomId) {
          callback((prevMessages) => {
            const existingIndex = prevMessages.findIndex(m => m.id === payload.new.id);
            if (existingIndex !== -1) {
              // Update the existing message
              const updatedMessages = [...prevMessages];
              updatedMessages[existingIndex] = {...prevMessages[existingIndex], ...payload.new, status: 'confirmed'};
              return updatedMessages;
            } else {
              // New message, add to the list
              return [...prevMessages, {...payload.new, status: 'confirmed'}];
            }
          });
                  }
      }
    )
    .on(
      "postgres_changes",
      { event: "INSERT", schema: "public", table: "transactions" },
      (payload) => {
        console.log("New transaction received!", payload.new);
        callback((prevMessages) =>
          prevMessages.map((message) => {
            console.log("Checking message", message.id, payload.new.message_id);
            if (message.id === payload.new.message_id) {
              // Add or update the transaction details for the message
              console.log("Updating message with transaction details", message);
              return { ...message,  ...payload.new };
            }
            return message;
          })
        );
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



export const getMe = async (address: string, supabase: SupabaseClient,) => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('address', address)
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
      .from('chat_rooms')
      .select('*')
      .contains('participants', [address]);

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
          .from('users')
          .select('*')
          .eq('address', otherParticipantAddress)
          .single();

        if (userError) throw userError;

        // Format the timestamp
        const timestamp = new Date(chatRoom.last_message_timestamp);
        const formattedTimestamp =
          timestamp.getFullYear() +
          '-' +
          ('0' + (timestamp.getMonth() + 1)).slice(-2) +
          '-' +
          ('0' + timestamp.getDate()).slice(-2) +
          ' ' +
          ('0' + timestamp.getHours()).slice(-2) +
          ':' +
          ('0' + timestamp.getMinutes()).slice(-2);

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
    console.error('Error getting chat rooms with user details:', error);
    throw error;
  }
};

export const fetchInitialMessages = async (supabase, chatRoomId, page, limit) => {
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit - 1;

  const { data, error } = await supabase
    .from('messages')
    .select(`
      *,
      transactions (
        transaction_hash,
        wei_value
      )
    `)
    .eq('chat_room_id', chatRoomId)
    .order('created_at', { ascending: false })
    // Use correct range for descending order
    .range(startIndex, endIndex);

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




