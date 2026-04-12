import { db } from "../lib/firebase";
import { collection, getDocs } from "firebase/firestore";

// GET ALL LEADS
export const getLeads = async () => {
  const snapshot = await getDocs(collection(db, "leads"));

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
};