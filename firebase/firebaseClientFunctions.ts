import {
  Firestore,
  getDoc,
  orderBy,
  serverTimestamp,
  startAfter,
  updateDoc,
  limit,
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

export const getMyChatRooms = async (db: Firestore, address: string) => {
  try {
    const ref = collection(db, "chatRooms");
    const q = query(ref, where("users", "array-contains", address));
    const snapshot = await getDocs(q);

    return snapshot.docs.map((doc) => doc.data());
  } catch (error) {
    console.error("Error getting users:", error);
    throw error;
  }
};
