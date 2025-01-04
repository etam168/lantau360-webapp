import type { CheckIn } from "../entities/checkin";
import typia from "typia";

export interface CheckInView extends CheckIn {
  siteData?: Record<string, any>;
}

const { resetObject } = useUtilities();

export const randomCheckInView = () => typia.random<CheckInView>();
export const newCheckInView: CheckInView = resetObject(typia.random<CheckInView>());
