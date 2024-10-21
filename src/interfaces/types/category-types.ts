import type { AdvertisementView } from "@/interfaces/models/views/advertisement-view";
import type { BusinessView } from "@/interfaces/models/views/business-view";
import type { CheckIn } from "../models/entities/checkin";
import type { PostingView } from "@/interfaces/models/views/posting-view";
import type { SiteView } from "@/interfaces/models/views/site-view";
import type { Transaction } from "@/interfaces/models/entities/transaction";

export type CategoryTypes =
  | AdvertisementView
  | BusinessView
  | CheckIn
  | PostingView
  | SiteView
  | Transaction;
