import { BusinessView } from "@/interfaces/models/views/business-view";
import { Posting } from "@/interfaces/models/entities/posting";
import { SiteView } from "@/interfaces/models/views/site-view";
import { AdvertisementView } from "@/interfaces/models/views/advertisement-view";

export type CategoryTypes = AdvertisementView | BusinessView | SiteView | Posting;
