import { db } from "../lib/firebase";
import { collection, getDocs, addDoc } from "firebase/firestore";

export type Lead = {
  id: string;
  name: string;
  phone: string;
  service: string;
  status: string;
};

export const getLeads = async (): Promise<Lead[]> => {
  const snapshot = await getDocs(collection(db, "leads"));

  return snapshot.docs.map((doc) => {
    const data = doc.data() as Partial<Lead>;

    return {
      id: doc.id,
      name: data.name ?? "",
      phone: data.phone ?? "",
      service: data.service ?? "",
      status: data.status ?? "",
    };
  });
};

export const createLead = async (lead: Omit<Lead, "id">) => {
  await addDoc(collection(db, "leads"), {
    ...lead,
    createdAt: new Date(),
  });
};