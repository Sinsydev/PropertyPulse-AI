import { db } from "../lib/firebase";
import {
  addDoc,
  collection,
  doc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { LEAD_STATUSES, type LeadRecord, type LeadStatus } from "../types/business";

const LEADS_COLLECTION = "leads";

export type LeadInput = Omit<LeadRecord, "id" | "createdAt">;
export type LeadStatusSummary = Record<LeadStatus, number>;

export const summarizeLeadStatuses = (
  leads: Array<{ status?: string | null }>
): LeadStatusSummary => {
  const summary = LEAD_STATUSES.reduce((acc, status) => {
    acc[status] = 0;
    return acc;
  }, {} as LeadStatusSummary);

  for (const lead of leads) {
    const normalized = normalizeLeadStatus(lead.status ?? "new");
    summary[normalized] += 1;
  }

  return summary;
};

export const normalizeLeadStatus = (status?: string | null): LeadStatus => {
  const normalized = (status ?? "").trim().toLowerCase();

  if (!normalized) {
    return "new";
  }

  if (!LEAD_STATUSES.includes(normalized as LeadStatus)) {
    throw new Error("Unsupported lead status");
  }

  return normalized as LeadStatus;
};

export const normalizeLeadInput = (
  lead: Partial<Omit<LeadInput, "status">> & { status?: string | null }
): LeadInput => {
  const name = typeof lead.name === "string" ? lead.name.trim() : "";
  const phone =
    typeof lead.phone === "string" ? lead.phone.replace(/\D/g, "") : "";
  const service =
    typeof lead.service === "string" ? lead.service.trim().toLowerCase() : "";
  const businessId =
    typeof lead.businessId === "string" ? lead.businessId.trim() : "";

  const status = normalizeLeadStatus(
    typeof lead.status === "string" && lead.status.trim()
      ? lead.status
      : "new"
  );

  if (!name) {
    throw new Error("Lead name is required");
  }

  if (!businessId) {
    throw new Error("Business ID is required");
  }

  return {
    name,
    phone,
    service,
    businessId,
    status,
  };
};

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
  const normalizedLead = normalizeLeadInput(lead);

  await addDoc(collection(db, LEADS_COLLECTION), {
    ...normalizedLead,
    createdAt: new Date(),
  });
};

export const updateLeadStatus = async (
  leadId: string,
  status: string
): Promise<void> => {
  const normalizedStatus = normalizeLeadStatus(status);

  await updateDoc(doc(db, LEADS_COLLECTION, leadId), {
    status: normalizedStatus,
  });
};