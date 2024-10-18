import { BaseImage } from "../base-entities/base-image";

export interface MemberImage extends BaseImage {
  memberId: number;
}

import typia from "typia";
export const randomMemberImage = () => typia.random<MemberImage>();


const { resetObject } = useUtilities();

export const newMemberImage: MemberImage = resetObject(
  typia.random<MemberImage>()
);