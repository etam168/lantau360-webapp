import { BusinessPromotion } from "../entities/business-promotion";

export interface BusinessPromotionView extends BusinessPromotion {
  businessName: string;
  directoryName: string;
  directoryTemplate: number;
}
