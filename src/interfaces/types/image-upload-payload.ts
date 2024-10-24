// image-upload-payload .ts
import type { GalleryImageType } from "@/interfaces/types/gallery-image-type";

export type ImageUploadPayload = {
  file: File;
  imageData: GalleryImageType;
};
