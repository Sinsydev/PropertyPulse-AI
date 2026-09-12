export const LEAD_STATUSES = [
  "new",
  "contacted",
  "qualified",
  "booked",
  "closed",
] as const;

export type LeadStatus = (typeof LEAD_STATUSES)[number];

export interface BusinessRecord {
  id: string;
  userId: string;
  businessName: string;
  phone: string;
  service: string;
  createdAt?: Date;
}

export interface LeadRecord {
  id: string;
  name: string;
  phone: string;
  service: string;
  status: LeadStatus;
  businessId: string;
  createdAt?: Date;
}
