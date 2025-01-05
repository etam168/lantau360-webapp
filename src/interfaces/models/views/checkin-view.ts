import type { CheckIn } from "../entities/checkin";
import typia from "typia";
import { SiteView } from "./site-view";

export interface CheckInView extends CheckIn {
  siteData?: SiteView;
}

const { resetObject } = useUtilities();

export const randomCheckInView = () => typia.random<CheckInView>();
export const newCheckInView: CheckInView = resetObject(typia.random<CheckInView>());
