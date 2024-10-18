// image-upload-payload .ts
import type { GalleryImageType } from "@/interfaces/types/gallery-image-types";

export type ImageUploadPayload = {
  file: File;
  imageData: GalleryImageType;
};
