import typia from "typia";

export interface CheckIn {
  checkInId: number;
  memberId: number;
  siteId: number;
  checkInfo: any[]; // Just a JSON array;
  createdAt: Date;
  createdBy: number;
  modifiedAt: Date;
  modifiedBy?: number;
  meta?: Record<string, any>;
  siteData: Record<string, any>;
}

const { resetObject } = useUtilities();

export const randomCheckIn = () => typia.random<CheckIn>();
export const newCheckIn: CheckIn = resetObject(typia.random<CheckIn>());
