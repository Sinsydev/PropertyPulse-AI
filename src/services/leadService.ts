import { db } from "../lib/firebase";
import { collection, getDocs, addDoc } from "firebase/firestore";

export type Lead = {
  id: string;
  name: string;
  phone: string;
  service: string;
  status: string;
  businessId: string;
};

import {
  query,
  where,
} from "firebase/firestore";

export const getLeads = async (
  businessId: string
): Promise<Lead[]> => {
  const q = query(
    collection(db, "leads"),
    where("businessId", "==", businessId)
  );

  const snapshot = await getDocs(q);

  return snapshot.docs.map((doc) => {
    const data = doc.data() as Omit<Lead, "id">;

    return {
      id: doc.id,
      ...data,
    };
  });
};

export const createLead = async (lead: Omit<Lead, "id">) => {
  await addDoc(collection(db, "leads"), {
    ...lead,
    createdAt: new Date(),
  });
};