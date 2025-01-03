import { CheckIn } from "../entities/checkin";

export interface CheckInView extends CheckIn {
  siteData?: Record<string, any>;
}
