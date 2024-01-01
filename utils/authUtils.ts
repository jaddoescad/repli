import nookies from 'nookies';
import initializeFirebaseServer from '../firebase/initFirebaseAdmin';
import { getUser } from '../pages/api/thirdWebAuth/[...thirdweb]';
import { checkTwitterHandleKeyExistsForSpecificUser } from '../firebase/firebaseServerFunctions';
import { GetServerSidePropsContext } from 'next';
import { Firestore } from 'firebase-admin/firestore';


export const verifyAuthentication = async (ctx: GetServerSidePropsContext) => {
  const cookies = nookies.get(ctx);
  const { auth } = initializeFirebaseServer();
  const token = await auth.verifyIdToken(cookies.token);
  const user = await getUser(ctx.req);

  if (!user || !user.address || !token) {
    return null;
  }

  return user;
};

export const checkTwitterHandle = async (db: Firestore, address: string) => {
  return await checkTwitterHandleKeyExistsForSpecificUser(db, address);
};