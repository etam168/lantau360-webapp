export interface CheckIn {
  checkInId?: number;
  siteId: number;
  memberId: number;
  checkInfo: Record<string, any>;
  createdBy: number;
  createdAt: Date;
  modifiedBy?: number;
  modifiedAt?: Date;
  meta?: Record<string, any>;
}
