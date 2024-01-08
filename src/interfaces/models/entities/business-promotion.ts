import { BaseDirectoryItem } from "../base-entities/base-directory-item";

export interface BusinessPromotion extends BaseDirectoryItem {
  businessPromotionId: number;
  businessId: number;
  openTime: string;
  closeTime: string;
}
