import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// 🔥 Firebase Config (PropertyPulse AI)
const firebaseConfig = {
  apiKey: "AIzaSyBhTwMCbv_q6eTvXmZPd2VTXIlxkzY36RE",
  authDomain: "propertypulse-ai-76bef.firebaseapp.com",
  projectId: "propertypulse-ai-76bef",
  storageBucket: "propertypulse-ai-76bef.firebasestorage.app",
  messagingSenderId: "607040417308",
  appId: "1:607040417308:web:134567c8c5cfeba1d8f9d9",
};

// 🚀 Initialize Firebase
const app = initializeApp(firebaseConfig);

// 🔐 Auth (for login/signup system)
export const auth = getAuth(app);

// 🗄 Firestore (database for SaaS data)
export const db = getFirestore(app);
 