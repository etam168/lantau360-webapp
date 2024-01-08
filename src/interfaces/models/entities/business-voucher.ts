import { BaseDirectoryItem } from "../base-entities/base-directory-item";

export interface BusinessVoucher extends BaseDirectoryItem {
  businessVoucherId: number;
  businessId: number;
  openTime: string;
  closeTime: string;
}
