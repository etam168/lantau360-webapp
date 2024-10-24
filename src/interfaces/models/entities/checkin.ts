export interface CheckIn {
  checkInId: number;
  memberId: number;
  siteId: number;
  checkInfo: Record<string, any>;
  createdAt: Date;
  createdBy: number;
  modifiedAt: Date;
  modifiedBy?: number;
  meta?: Record<string, any>;
}
