import { BaseImage } from "../base-entities/base-image";

export interface PostingImage extends BaseImage {
  imageId: number;
  postingId: number;
  ranking: number;
  imagePath: string;
  meta: Record<string, unknown>;
}
