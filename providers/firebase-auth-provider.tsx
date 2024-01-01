import { createContext, useContext, useEffect, useState } from 'react';
import initializeFirebaseClient from '../firebase/initFirebase';
import { onAuthStateChanged, User, onIdTokenChanged } from "firebase/auth";
import nookies from 'nookies';

const FirAuthContext = createContext<{ user: User | null }>({
  user: null,
});

export function FirAuthProvider({ children }: any) {
  const [user, setUser] = useState<User | null>(null);
  const { auth } = initializeFirebaseClient();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const listener = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        setUser(null);
        setIsLoading(false);
        nookies.set(undefined, 'token', '', { path: '/' });
      } else {
        const token = await user.getIdToken();
        setUser(user);
        setIsLoading(false);
        nookies.set(undefined, 'token', token, { path: '/' });
      }
    });
    return () => {
      listener();
    };
  }, [auth]);

  return (
    <FirAuthContext.Provider value={{ user }}>{children}</FirAuthContext.Provider>
  );
}

export const useFirAuth = () => {
  return useContext(FirAuthContext);
};