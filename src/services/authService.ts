import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";

 import { auth } from "../lib/firebase";

// 🔐 SIGN UP
export const signup = (email: string, password: string) => {
  return createUserWithEmailAndPassword(auth, email, password);
};

// 🔑 LOGIN
export const login = (email: string, password: string) => {
  return signInWithEmailAndPassword(auth, email, password);
};

// 🚪 LOGOUT
export const logout = () => {
  return signOut(auth);
};