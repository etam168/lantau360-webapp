export interface CheckIn {
  checkInId: number;
  memberId: number;
  siteId: number;
  checkInfo: any[]; // Just a JSON array;
  createdAt: Date;
  createdBy: number;
  modifiedAt: Date;
  modifiedBy?: number;
  meta?: Record<string, any>;
}
