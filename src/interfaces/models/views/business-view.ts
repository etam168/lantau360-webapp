import { Business } from "../entities/business";

export interface BusinessView extends Business {
  areaName: string;
  directoryName: string;
  directoryMeta: Record<string, any>;
  areaNameAlt: Record<string, any>;
  directoryTemplate: number;
}
