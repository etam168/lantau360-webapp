export interface CheckIn {
  checkInId?: number;
  siteId: number;
  description: string;
  status: number;
  userLocation: Record<string, any>;
  createdBy: number;
  createdAt: Date;
  modifiedBy?: number;
  modifiedAt?: Date;
  meta?: Record<string, any>;
}
