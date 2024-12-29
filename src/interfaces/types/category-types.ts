import type { AdvertisementView } from "@/interfaces/models/views/advertisement-view";
import type { BusinessView } from "@/interfaces/models/views/business-view";
import type { BusinessPromotionView } from "@/interfaces/models/views/business-promotion-view";
import type { BusinessVoucherView } from "@/interfaces/models/views/business-voucher-view";
import type { CommunityEventView } from "@/interfaces/models/views/community-event-view";
import type { CommunityNewsView } from "@/interfaces/models/views/community-news-view";
import type { CommunityNoticeView } from "@/interfaces/models/views/community-notice-view";
import type { PostingView } from "@/interfaces/models/views/posting-view";
import type { SiteView } from "@/interfaces/models/views/site-view";
import type { CheckInView } from "@/interfaces/models/views/checkin-view";
import type { TransactionView } from "../models/views/trasaction-view";

export type CategoryTypes =
  | AdvertisementView
  | BusinessView
  | BusinessPromotionView
  | BusinessVoucherView
  | CheckInView
  | CommunityEventView
  | CommunityNewsView
  | CommunityNoticeView
  | PostingView
  | SiteView
  | TransactionView;
