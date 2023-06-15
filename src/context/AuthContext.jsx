import { createContext, useContext, useEffect, useState } from "react";

import {
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";

import { auth, db } from "../firebase";

const providerGoogle = new GoogleAuthProvider();
const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  let userData;
  const [currentUser, setCurrentUser] = useState(() => []);
  const [loading, setLoading] = useState(true)
  const [userNameArr, setUserNameArr] = useState('');

  // Realtime Tracking & Persisting Authentication state of the user
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(() => user);   //user.uid not .id :')
      setUserNameArr(user?.displayName?.split(' '))
      // console.log(user)
      setLoading(() => false)
    });

    return () => unsubscribe();
  }, []);

  // create user required info.s document in user collection
  async function createUserDoc(result) {
    const userCollectionRef = doc(db, `user`, result.user.uid)
    userData = await getDoc(userCollectionRef);

    if (userData.exists()) return;
    else return setDoc(userCollectionRef,
      {
        'created_at': serverTimestamp(),
        'first_name': result._tokenResponse.firstName,
        'last_name': result._tokenResponse.lastName,
        'photo': result.user.photoURL,
        'joined_groups': [],
      }
    )
  }

  // Authentication of user
  function signInWithGoogle() {
    return signInWithPopup(auth, providerGoogle)
  }

  // log out current user
  function logOut() {
    return signOut(auth);
  }

  const value = {
    currentUser, userNameArr,
    createUserDoc, signInWithGoogle, logOut,
  };

  return (
    <AuthContext.Provider value={value}>
      {
        !loading ?
          children
          :
          <h1 style={{ textAlign: 'center' }}>Loading...</h1>
      }
    </AuthContext.Provider>
  );
}
