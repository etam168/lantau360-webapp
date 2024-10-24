import { AdvertisementImage } from "@/interfaces/models/entities/advertisement-image";
import { PromotionImage } from "@/interfaces/models/entities/promotion-image";
import { voucherImage } from "@/interfaces/models/entities/voucher-image";

import { BusinessImage } from "@/interfaces/models/entities/business-image";
import { SiteImage } from "@/interfaces/models/entities/site-image";

import { CommunityEventImage } from "@/interfaces/models/entities/community-event-image";
import { CommunityNewsImage } from "@/interfaces/models/entities/community-news-image";
import { CommunityNoticeImage } from "@/interfaces/models/entities/community-notice-image";
import { PostingImage } from "@/interfaces/models/entities/posting-image";

import { MemberImage } from "@/interfaces/models/entities/member-image";

export type GalleryImageType =
  | AdvertisementImage
  | BusinessImage
  | CommunityEventImage
  | CommunityNewsImage
  | CommunityNoticeImage
  | PromotionImage
  | SiteImage
  | voucherImage
  | MemberImage
  | PostingImage;
