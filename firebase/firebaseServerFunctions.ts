import { User } from "@thirdweb-dev/auth";
import {
  Firestore,
  Firestore as FirestoreServer,
} from "firebase-admin/firestore";
import { TwitterExtendedUser } from "../types/types";
import { doc, updateDoc } from "firebase/firestore";

export const checkTwitterHandleKeyExistsForSpecificUser = async (
  db: FirestoreServer,
  userID: string
): Promise<boolean> => {
  try {
    const querySnapshot = await db.collection("users").doc(userID).get();

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

export const saveTwitterInfoInFirestoreServer = async (
  db: Firestore,
  userId: string,
  twitterId: string,
  twitterHandle: string,
  twitterName: string,
  avatarUrl: string
) => {
  db.collection("users").doc(userId).set(
    {
      twitterId: twitterId,
      twitterHandle: twitterHandle,
      twitterName: twitterName,
      avatarUrl: avatarUrl,
      address: userId,
      createdAt: new Date(),
    },
    { merge: true }
  );
};
