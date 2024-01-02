import {
  Firestore,
  getDoc,
  orderBy,
  serverTimestamp,
  startAfter,
  updateDoc,
  limit,
  addDoc,
  runTransaction,
  onSnapshot,
} from "firebase/firestore";
import { collection, query, where, getDocs } from "firebase/firestore";
import { Auth, getAuth } from "firebase/auth";

import { User, signInWithCustomToken } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { TwitterExtendedUser } from "../types/types";

export const saveTwitterInfoInFirestore = async (
  db: Firestore,
  user: User,
  twitterInfo: TwitterExtendedUser
) => {
  const docRef = doc(db, "users", user.uid);

  await updateDoc(docRef, {
    twitterId: twitterInfo.id,
    twitterHandle: twitterInfo.username,
    twitterName: twitterInfo.name,
  });
};

export const signIn = async (
  token: string,
  auth: Auth,

  db: Firestore
) => {
  // Use the same address as the one specified in _app.tsx.
  try {
    // Sign in with the token.
    const userCredential = await signInWithCustomToken(auth, token);
    // On success, we have access to the user object.
    const user = userCredential.user;

    // If this is a new user, we create a new document in the database.
    const usersRef = doc(db, "users", user.uid!);
    const userDoc = await getDoc(usersRef);

    if (!userDoc.exists()) {
      // User now has permission to update their own document outlined in the Firestore rules.
      setDoc(
        usersRef,
        { createdAt: serverTimestamp(), address: user.uid },
        { merge: true }
      );
    }
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const signOut = async (auth: Auth) => {
  try {
    await auth.signOut();
  } catch (error) {
    console.error(error);
  }
};

export const checkTwitterHandleExistsClientSide = async (
  db: Firestore,
  userID: string
): Promise<boolean> => {
  try {
    const querySnapshot = await getDoc(doc(db, "users", userID));

    //check if twitterHandle key   exists
    if (
      !querySnapshot.data()?.twitterHandle ||
      !querySnapshot.data()?.twitterName ||
      !querySnapshot.data()?.twitterId
    ) {
      return false;
    }

    return true;
  } catch (error) {
    console.error("Error checking Twitter handle:", error);
    throw error;
  }
};

export const getUsersWithPagination = async (
  db: Firestore,
  address: string
) => {
  try {
    const ref = collection(db, "users");
    const q = query(ref, limit(3), where("address", "!=", address));
    const snapshot = await getDocs(q);

    return snapshot.docs.map((doc) => doc.data());
  } catch (error) {
    console.error("Error getting users:", error);
    throw error;
  }
};

export const getMe = async (db: Firestore, address: string) => {
  try {
    const me = await getDoc(doc(db, "users", address));
    return me.data();
  } catch (error) {
    console.error("Error getting users:", error);
    throw error;
  }
};
export const getMyChatRooms = async (
  db: Firestore,
  address: string
) => {
  try {
    const chatRoomsRef = collection(db, "chatRooms");
    const q = query(chatRoomsRef, where("participants", "array-contains", address));
    const querySnapshot = await getDocs(q);

    const chatRoomsWithUserDetails = await Promise.all(querySnapshot.docs.map(async (chatRoomDoc) => {
      const chatRoomData = chatRoomDoc.data();
      const otherParticipantAddress = chatRoomData.participants.find((p: string) => p !== address);
      const userRef = doc(db, "users", otherParticipantAddress);
      const userDoc = await getDoc(userRef);
      const userData = userDoc.data();

      // Format the timestamp
      const timestamp = new Date(chatRoomData.lastMessageTimestamp.seconds * 1000);
      const formattedTimestamp = timestamp.getFullYear() + '-' + 
                 ('0' + (timestamp.getMonth() + 1)).slice(-2) + '-' + 
                 ('0' + timestamp.getDate()).slice(-2) + ' ' +
                 ('0' + timestamp.getHours()).slice(-2) + ':' +
                 ('0' + timestamp.getMinutes()).slice(-2);

      return {
        id: chatRoomDoc.id,
        lastMessage: chatRoomData.lastMessage,
        lastMessageTimestamp: formattedTimestamp,
        otherParticipant: {
          address: otherParticipantAddress,
          name: userData?.twitterName,
          image: userData?.avatarUrl,
          handle: userData?.twitterHandle
        },
        // Add any other chat room details you need
      };
    }));

    return chatRoomsWithUserDetails;
  } catch (error) {
    console.error("Error getting chat rooms with user details:", error);
    throw error;
  }
};



export const getChatUser = async (db: Firestore, address: string) => {
  try {
    const user = await getDoc(doc(db, "users", address));
    return user.data();
  } catch (error) {
    console.error("Error getting users:", error);
    throw error;
  }
};

//send message in subcollection for charoom called messages
export const sendMessage = async (db: Firestore, userId: string, recipientId: string, message: string) => {
  const order = checkOrder(userId, recipientId);
  const chatRoomId = "chat_" + order[0] + "_" + order[1];
  const chatRoomRef = doc(db, "chatRooms", chatRoomId);

  // Start a Firestore transaction to ensure atomicity
  await runTransaction(db, async (transaction) => {
    const chatRoomDoc = await transaction.get(chatRoomRef);

    // If the chat room doesn't exist, create it
    if (!chatRoomDoc.exists()) {
      transaction.set(chatRoomRef, {
        participants: order,
        createdAt: serverTimestamp(),
        lastMessage: message,
        lastMessageTimestamp: serverTimestamp(),
      });
    } else {
      // If the chat room exists, update the last message and timestamp
      transaction.update(chatRoomRef, {
        lastMessage: message,
        lastMessageTimestamp: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
    }

    // Reference to the 'messages' collection
    const colRef = collection(db, "chatRooms", chatRoomId, "messages");

    // Add the new message to the 'messages' collection
    transaction.set(doc(colRef), {
      message: message,
      sender: userId,
      recipient: recipientId,
      createdAt: serverTimestamp(),
    });
  });
};

const checkOrder = (userId: string, recipientId: string) => {
  const order = [userId, recipientId].sort();
  return order;
};


export const getChatRoomId = (userId: string, recipientId: string) => {
  const order = checkOrder(userId, recipientId);
  const chatRoomId = "chat_" + order[0] + "_" + order[1];
  return chatRoomId;
};


export const onChatMessages = (db: Firestore, chatRoomId: string, callback: (messages: any[]) => void) => {
  console.log("id", chatRoomId)
  const messagesRef = collection(db, "chatRooms", chatRoomId, "messages");
  return onSnapshot(query(messagesRef, orderBy("createdAt")), (snapshot) => {
    const messages = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    callback(messages);
  });
};

