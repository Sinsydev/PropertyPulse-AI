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

export type BusinessInput = Omit<BusinessRecord, "id" | "createdAt">;

export const normalizeBusinessInput = (
  business: Partial<BusinessInput>
): BusinessInput => {
  const userId = typeof business.userId === "string" ? business.userId.trim() : "";
  const businessName =
    typeof business.businessName === "string" ? business.businessName.trim() : "";
  const phone =
    typeof business.phone === "string" ? business.phone.replace(/\D/g, "") : "";
  const service =
    typeof business.service === "string" ? business.service.trim().toLowerCase() : "";

  if (!userId) {
    throw new Error("User ID is required");
  }

  if (!businessName) {
    throw new Error("Business name is required");
  }

  if (!phone) {
    throw new Error("Business phone is required");
  }

  return {
    userId,
    businessName,
    phone,
    service,
  };
};

export const createBusiness = async (
  data: Omit<BusinessRecord, "id" | "createdAt">
): Promise<void> => {
  const normalizedBusiness = normalizeBusinessInput(data);

  await addDoc(collection(db, BUSINESSES_COLLECTION), {
    ...normalizedBusiness,
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