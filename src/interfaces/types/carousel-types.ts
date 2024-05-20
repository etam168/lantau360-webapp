// Interface files
import { AdvertisementView } from "../models/views/advertisement-view";
import { SiteView } from "../models/views/site-view";

// Define type that is a union of Site and Advertisement
export type CarouselTypes = SiteView | AdvertisementView;
