import { BaseImage } from "../base-entities/base-image";

export interface PostingImage extends BaseImage {
  postingId: number;
}
