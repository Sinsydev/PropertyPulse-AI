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
  status: string;
  businessId: string;
  createdAt?: Date;
}
