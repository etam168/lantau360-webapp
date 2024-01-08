import { BaseDirectoryItem } from "../base-enities/directory-item";

export interface Business extends BaseDirectoryItem {
  businessId: number;
  businessName: string;
  openTime: string;
  closeTime: string;
}
