import { BusinessView } from "@/interfaces/models/views/business-view";
import { Posting } from "@/interfaces/models/entities/posting";
import { SiteView } from "@/interfaces/models/views/site-view";
import { Advertisement } from "@/interfaces/models/entities/advertisement";

export type CategoryTypes = Advertisement | BusinessView | SiteView | Posting;
