import { QOptionGroupProps } from "quasar";

export interface PriceRange {
  min: number;
  max: number | null;
}

export interface SizeRange {
  min: number;
  max: number | null;
}

export interface BedRange {
  min: number;
  max: number | null;
}

export interface SearchBarOptions {
  territories: Record<string, any>;
  features: QOptionGroupProps["options"];
  propertyTypes: QOptionGroupProps["options"];
}

export enum SearchMode {
  Buy = "buy",
  Rent = "rent"
}
