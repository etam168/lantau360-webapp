export interface voucherImage {
  imageId?: number;
  businessVoucherId: number;
  ranking: number;
  imagePath: string;
  meta: Record<string, unknown>;
  createdAt: Date;
  createdBy: number;
  modifiedAt: Date;
  modifiedBy: number;
}
