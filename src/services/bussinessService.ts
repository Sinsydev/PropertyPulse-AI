import { db } from "../lib/firebase";
import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";

/* =========================
   BUSINESS TYPE
========================= */
export type Business = {
  id: string;
  userId: string;
  businessName: string;
  phone: string;
  service: string;
};

/* =========================
   CREATE BUSINESS
========================= */
export const createBusiness = async (
  data: Omit<Business, "id">
) => {
  await addDoc(collection(db, "businesses"), {
    ...data,
    createdAt: new Date(),
  });
};

/* =========================
   GET BUSINESS BY USER
========================= */
export const getBusinessByUser = async (
  userId: string
): Promise<Business | null> => {
  const q = query(
    collection(db, "businesses"),
    where("userId", "==", userId)
  );

  const snapshot = await getDocs(q);

  if (snapshot.empty) return null;

  const doc = snapshot.docs[0];
  const data = doc.data() as Omit<Business, "id">;

  return {
    id: doc.id,
    ...data,
  };
};