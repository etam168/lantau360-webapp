import { Advertisement } from "../entities/advertisement";

export interface AdvertisementView extends Advertisement {
  directoryName: string;
  businessName: string;
  directoryTemplate: number;
}
