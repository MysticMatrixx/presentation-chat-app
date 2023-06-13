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
  const [currentUser, setCurrentUser] = useState();
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user); //user.uid not .id :')
      console.log("USER EFFECTED")
      setLoading(false)
    });

    return unsubscribe;
  }, []);


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

  // authentication user
  function signInWithGoogle() {
    return signInWithPopup(auth, providerGoogle)
  }

  // const credential = GoogleAuthProvider.credentialFromResult(result);

  // const info = {
  //     access_token: credential?.accessToken || null,
  //     uid: result.user.uid,
  //     first_name: result._tokenResponse.firstName,
  //     last_name: result._tokenResponse.lastName,
  //     email: result.user.email,
  //     photo: result.user.photoURL,
  // };
  // console.log(info);

  function logOut() {
    return signOut(auth);
  }

  const value = {
    currentUser,
    createUserDoc, signInWithGoogle, logOut,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
