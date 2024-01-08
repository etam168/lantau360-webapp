import { BaseDirectoryItem } from "../base-enities/directory-item";

export interface BusinessPromotion extends BaseDirectoryItem {
  businessPromotionId: number;
  businessId: number;
  openTime: string;
  closeTime: string;
}
