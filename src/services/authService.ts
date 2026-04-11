 import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";

import { auth, db } from "../lib/firebase";
import { doc, setDoc } from "firebase/firestore";

// 🔐 SIGN UP + CREATE USER IN DB
export const signup = async (email: string, password: string) => {
  const userCredential = await createUserWithEmailAndPassword(
    auth,
    email,
    password
  );

  const user = userCredential.user;

  // 🧠 store user in Firestore
  await setDoc(doc(db, "users", user.uid), {
    email: user.email,
    createdAt: new Date(),
    businessId: null,
  });

  return userCredential;
};

// 🔑 LOGIN
export const login = (email: string, password: string) => {
  return signInWithEmailAndPassword(auth, email, password);
};

// 🚪 LOGOUT
export const logout = () => {
  return signOut(auth);
};