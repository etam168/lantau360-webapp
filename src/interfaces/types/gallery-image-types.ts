import { AdvertisementImage } from "@/interfaces/models/entities/advertisement-image";
import { PromotionImage } from "@/interfaces/models/entities/promotion-image";
import { voucherImage } from "@/interfaces/models/entities/voucher-image";

import { BusinessImage } from "@/interfaces/models/entities/business-image";
import { SiteImage } from "@/interfaces/models/entities/site-image";

export type GalleryImageType =
  | AdvertisementImage
  | BusinessImage
  | PromotionImage
  | SiteImage
  | voucherImage;
