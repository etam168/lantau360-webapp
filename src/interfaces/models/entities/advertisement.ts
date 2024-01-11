import { BaseDirectoryItem } from "../base-entities/base-directory-item";

export interface Advertisement extends BaseDirectoryItem {
  advertisementId: number;
  businessId: number;
  advertisementName: string;
  openTime: string;
  closeTime: string;
  titleAlt: Record<string, any>;
  expiryDate: Date;
}
