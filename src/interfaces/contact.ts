export interface Contact {
  contactId: number;
  contactName: string;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  password: string;
  ageGroup: number;
  otherInfo: string;
  status: number;
  createdBy: number;
  createdAt: Date;
  modifiedBy: number;
  modifiedAt: Date;
  meta?: Record<string, unknown> | null;
}
