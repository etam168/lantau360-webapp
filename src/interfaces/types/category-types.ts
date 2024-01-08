import { BusinessView } from "@/interfaces/models/views/business-view";
import { PostingView } from "@/interfaces/models/views/posting-view";
import { SiteView } from "@/interfaces/models/views/site-view";
import { AdvertisementView } from "@/interfaces/models/views/advertisement-view";

export type CategoryTypes = AdvertisementView | BusinessView | SiteView | PostingView;
