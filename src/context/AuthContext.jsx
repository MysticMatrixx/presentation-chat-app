import { createContext, useContext, useEffect, useState } from "react";
import {
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import { auth } from "../firebase";

const providerGoogle = new GoogleAuthProvider();
const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState();
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false)
    });

    return unsubscribe;
  }, []);

  function signInWithGoogle() {
    return signInWithPopup(auth, providerGoogle);
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

  async function logOut() {
    try {
      signOut(auth);
    } catch (err) {
      console.log(err);
    }
  }

  const value = {
    currentUser,
    signInWithGoogle,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
