export interface AuthUserProfile {
  email: string | null;
  createdAt: Date;
  businessId: string | null;
}

export interface SignupResult {
  uid: string;
  email: string | null;
}
