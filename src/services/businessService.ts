import { db } from "../lib/firebase";
import {
  addDoc,
  collection,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import type { BusinessRecord } from "../types/business";

const BUSINESSES_COLLECTION = "businesses";

export const createBusiness = async (
  data: Omit<BusinessRecord, "id" | "createdAt">
): Promise<void> => {
  await addDoc(collection(db, BUSINESSES_COLLECTION), {
    ...data,
    createdAt: new Date(),
  });
};

export const getBusinessByUser = async (
  userId: string
): Promise<BusinessRecord | null> => {
  const q = query(
    collection(db, BUSINESSES_COLLECTION),
    where("userId", "==", userId)
  );

  const snapshot = await getDocs(q);

  if (snapshot.empty) return null;

  const document = snapshot.docs[0];
  const data = document.data() as Omit<BusinessRecord, "id">;

  return {
    id: document.id,
    ...data,
  };
};