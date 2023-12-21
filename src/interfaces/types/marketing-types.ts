import { BusinessPromotion } from "@/interfaces/models/entities/business-promotion";
import { BusinessVoucher } from "@/interfaces/models/entities/business-voucher";
import { Advertisement } from "../models/entities/advertisement";

export type MarketingType = BusinessPromotion | BusinessVoucher | Advertisement;
