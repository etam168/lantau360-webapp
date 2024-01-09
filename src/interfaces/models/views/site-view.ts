import { Site } from "../entities/site";

export interface SiteView extends Site {
  areaName: string;
  directoryName: string;
  directoryMeta: Record<string, any>;
  areaNameAlt: Record<string, any>;
}
