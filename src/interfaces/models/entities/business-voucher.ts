import { BaseDirectoryItem } from "../base-enities/directory-item";

export interface BusinessVoucher extends BaseDirectoryItem {
  businessVoucherId: number;
  businessId: number;
  openTime: string;
  closeTime: string;
}
