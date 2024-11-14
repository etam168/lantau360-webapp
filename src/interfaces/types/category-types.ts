import type { AdvertisementView } from "@/interfaces/models/views/advertisement-view";
import type { BusinessView } from "@/interfaces/models/views/business-view";
import type { BusinessPromotionView } from "@/interfaces/models/views/business-promotion-view";
import type { BusinessVoucherView } from "@/interfaces/models/views/business-voucher-view";
import type { CheckIn } from "@/interfaces/models/entities/checkin";
import type { CommunityEvent } from "@/interfaces/models/entities/community-event";
import type { CommunityNotice } from "@/interfaces/models/entities/community-notice";
import type { PostingView } from "@/interfaces/models/views/posting-view";
import type { SiteView } from "@/interfaces/models/views/site-view";
import type { Transaction } from "@/interfaces/models/entities/transaction";
import type { CheckInView } from "@/interfaces/models/views/checkin-view";

export type CategoryTypes =
  | AdvertisementView
  | BusinessView
  | BusinessPromotionView
  | BusinessVoucherView
  // | CheckIn
  | CheckInView
  | CommunityEvent
  | CommunityNotice
  | PostingView
  | SiteView;
  // | Transaction;
