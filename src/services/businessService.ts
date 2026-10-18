import { requireDb } from "../lib/firebase";
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

const normalizePhoneNumber = (value: string): string =>
  value.replace(/\D/g, "");

export const normalizeBusinessInput = (
  business: Partial<BusinessInput>
): BusinessInput => {
  const userId = typeof business.userId === "string" ? business.userId.trim() : "";
  const businessName =
    typeof business.businessName === "string" ? business.businessName.trim() : "";
  const phone =
    typeof business.phone === "string" ? normalizePhoneNumber(business.phone) : "";
  const service =
    typeof business.service === "string" ? business.service.trim().toLowerCase() : "";
  const twilioNumber =
    typeof business.twilioNumber === "string"
      ? normalizePhoneNumber(business.twilioNumber)
      : "";

  if (!userId) {
    throw new Error("User ID is required");
  }

  if (!businessName) {
    throw new Error("Business name is required");
  }

  if (!phone) {
    throw new Error("Business phone is required");
  }

  if (!service) {
    throw new Error("Business service is required");
  }

  return {
    userId,
    businessName,
    phone,
    service,
    ...(twilioNumber ? { twilioNumber } : {}),
  };
};

export const createBusiness = async (
  data: Omit<BusinessRecord, "id" | "createdAt">
): Promise<void> => {
  const normalizedBusiness = normalizeBusinessInput(data);

  await addDoc(collection(requireDb(), BUSINESSES_COLLECTION), {
    ...normalizedBusiness,
    createdAt: new Date(),
  });
};

export const getBusinessByUser = async (
  userId: string
): Promise<BusinessRecord | null> => {
  const q = query(
    collection(requireDb(), BUSINESSES_COLLECTION),
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

export const getBusinessByInboundNumber = async (
  inboundNumber: string
): Promise<BusinessRecord | null> => {
  const normalized = normalizePhoneNumber(inboundNumber);

  if (!normalized) return null;

  const twilioQuery = query(
    collection(requireDb(), BUSINESSES_COLLECTION),
    where("twilioNumber", "==", normalized)
  );

  const twilioSnapshot = await getDocs(twilioQuery);

  if (!twilioSnapshot.empty) {
    const document = twilioSnapshot.docs[0];
    const data = document.data() as Omit<BusinessRecord, "id">;

    return {
      id: document.id,
      ...data,
    };
  }

  const businessPhoneQuery = query(
    collection(requireDb(), BUSINESSES_COLLECTION),
    where("phone", "==", normalized)
  );

  const businessPhoneSnapshot = await getDocs(businessPhoneQuery);

  if (businessPhoneSnapshot.empty) return null;

  const businessDocument = businessPhoneSnapshot.docs[0];
  const businessData = businessDocument.data() as Omit<BusinessRecord, "id">;

  return {
    id: businessDocument.id,
    ...businessData,
  };
};