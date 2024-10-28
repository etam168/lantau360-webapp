import { BaseImage } from "../base-entities/base-image";

export interface PostingImage extends BaseImage {
  imageId: number;
  postingId: number;
  ranking: number;
  imagePath: string;
  meta: Record<string, unknown>;
}

import typia from "typia";
export const randomPostingImage = () => typia.random<PostingImage>();

const { resetObject } = useUtilities();

export const newPostingImage: PostingImage = resetObject(typia.random<PostingImage>());
