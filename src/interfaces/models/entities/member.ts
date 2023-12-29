export interface Member {
  memberId: number;
  alias: string;
  firstName: string;
  lastName: string;
  userName: string;
  phone?: string;
  email: string;
  password: string;
  ageGroup: number;
  otherInfo: string;
  verifiedBy: number;
  verifiedTimestamp: Date;
  otp: string;
  points: number;
  imagePath: string;
  status?: number;
  createdAt: Date;
  createdBy: number;
  modifiedAt: Date;
  modifiedBy: number;
  meta: Record<string, unknown>;
}
