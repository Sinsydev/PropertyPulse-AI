import { initializeApp, type FirebaseApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";
import { getFirestore, type Firestore } from "firebase/firestore";
import { env, isEnvConfigured } from "./env";

let app: FirebaseApp | null = null;
let authClient: Auth | null = null;
let dbClient: Firestore | null = null;

if (isEnvConfigured) {
  app = initializeApp({
    apiKey: env.firebase.apiKey,
    authDomain: env.firebase.authDomain,
    projectId: env.firebase.projectId,
    storageBucket: env.firebase.storageBucket,
    messagingSenderId: env.firebase.messagingSenderId,
    appId: env.firebase.appId,
  });

  authClient = getAuth(app);
  dbClient = getFirestore(app);
}

export const auth = authClient;
export const db = dbClient;
export const isFirebaseReady = Boolean(app && authClient && dbClient);

export function requireAuth(): Auth {
  if (!authClient) {
    throw new Error(
      "Firebase Auth is not configured. Add your Firebase Web App values to .env.local; copying .env.example alone is not enough. Restart npm run dev after updating it."
    );
  }

  return authClient;
}

export function requireDb(): Firestore {
  if (!dbClient) {
    throw new Error(
      "Firebase is not configured. Add your Firebase Web App values to .env.local; copying .env.example alone is not enough. Restart npm run dev after updating it."
    );
  }

  return dbClient;
}
