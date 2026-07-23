import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  type UserCredential,
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../lib/firebase";
import type { AuthUserProfile, SignupResult } from "../types/auth";



export const getAuthErrorMessage = (error: unknown): string => {
  if (typeof error === "object" && error !== null && "code" in error) {
    const code = String((error as { code?: string }).code ?? "");

    if (code === "auth/invalid-credential") {
      return "Invalid email or password.";
    }
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "Something went wrong";
};

const USERS_COLLECTION = "users";

async function createUserProfile(
  userId: string,
  email: string | null
): Promise<void> {
  const profile: AuthUserProfile = {
    email,
    createdAt: new Date(),
    businessId: null,
  };

  await setDoc(doc(db, USERS_COLLECTION, userId), profile);
}

export const signup = async (
  email: string,
  password: string
): Promise<SignupResult> => {
  const userCredential: UserCredential = await createUserWithEmailAndPassword(
    auth,
    email,
    password
  );

  const { user } = userCredential;

  await createUserProfile(user.uid, user.email);

  return {
    uid: user.uid,
    email: user.email,
  };
};

export const login = (email: string, password: string) => {
  return signInWithEmailAndPassword(auth, email, password);
};

export const logout = () => {
  return signOut(auth);
};