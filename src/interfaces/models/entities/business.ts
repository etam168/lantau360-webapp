import { BaseDirectoryItem } from "../base-entities/base-directory-item";

export interface Business extends BaseDirectoryItem {
  businessId: number;
  businessName: string;
  openTime: string;
  closeTime: string;
}
