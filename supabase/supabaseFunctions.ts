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

export const getUsersWithPagination = async (
  supabase: any,
  address: string
) => {
  try {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .neq("address", address)
      .limit(3);

    if (error) {
      console.error("this is error", error);
      throw error;
    }

    console.log("data", data);

    return data;
  } catch (error) {
    console.error("Error getting users:", error);
    throw error;
  }
};

export const sendMessage = async (
  supabase: SupabaseClient,
  userId: string,
  recipientId: string,
  message: string,
  weiValue: number,
  mutateAsync: any,
  refetch: any
) => {
  const order = checkOrder(userId, recipientId);
  const chatRoomId = "chat_" + order[0] + "_" + order[1];
  try {
    // Update or create chat room
    let { data: chatRoomData, error: chatRoomError } = await supabase
      .from("chat_rooms")
      .upsert({
        id: chatRoomId,
        participants: [userId, recipientId],
        last_message: message,
        last_message_timestamp: "NOW()",
      });

    if (chatRoomError) throw chatRoomError;

    const messageId = uuidv4();
    // Send user message
    let { error: messageError } = await supabase.from("messages").insert({
      id: messageId,
      sender: userId,
      recipient: recipientId,
      message: message,
      chat_room_id: chatRoomId,
    });

    if (messageError) throw messageError;

    sendMoney(mutateAsync, weiValue, messageId, userId, recipientId);
    refetch();
  } catch (error) {
    console.error("An error occurred:", error);
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
          callback((prevMessages) => [...prevMessages, payload.new]);
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


export const fetchInitialMessages = async (supabase, chatRoomId, setChat) => {
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
    .limit(10); // You can adjust the limit as needed

  if (error) {
    console.error("Error fetching initial messages: ", error);
  } else {
    const formattedData = data.map((message) => {
      // Assuming each message has at most one associated transaction
      const transaction = message.transactions[0] || {};
      return { ...message, ...transaction };
    });
    setChat(formattedData);
  }
};



