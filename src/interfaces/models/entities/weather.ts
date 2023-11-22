export interface Weather {
  weatherInfoId: number;
  icon: string;
  unit: string;
  tempValue: number;
  caption: string;
  minTemp: number;
  maxTemp: number;
  forecastDateTime: string;
  createdAt: Date;
  createdBy: number;
  modifiedBy?: number | null;
  modifiedAt?: Date | null;
  meta: Record<string, unknown> | null;
}
