export interface Weather {
  weatherIconId: number;
  iconNo: number;
  caption: string;
  createdAt: Date;
  createdBy: number;
  modifiedBy?: number | null;
  modifiedAt?: Date | null;
  meta: Record<string, unknown> | null;
}
