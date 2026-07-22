import { db } from "../lib/firebase";
import { addDoc, collection, getDocs, query, where } from "firebase/firestore";
import type { LeadRecord } from "../types/business";

const LEADS_COLLECTION = "leads";

export const getLeads = async (
  businessId: string
): Promise<LeadRecord[]> => {
  const q = query(
    collection(db, LEADS_COLLECTION),
    where("businessId", "==", businessId)
  );

  const snapshot = await getDocs(q);

  return snapshot.docs.map((document) => {
    const data = document.data() as Omit<LeadRecord, "id">;

    return {
      id: document.id,
      ...data,
    };
  });
};

export const createLead = async (
  lead: Omit<LeadRecord, "id" | "createdAt">
): Promise<void> => {
  await addDoc(collection(db, LEADS_COLLECTION), {
    ...lead,
    createdAt: new Date(),
  });
};