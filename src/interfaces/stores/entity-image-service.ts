// @/interfaces/stores/entity-image-service.ts
import { GalleryImageType } from "../types/gallery-image-type";
import { ImageUploadPayload } from "../types//image-upload-payload";

export interface EntityImageService<T extends GalleryImageType> {
  getGalleryImages: (entityId: number) => Promise<T[]>;
  updateGalleryImages(
    images: (GalleryImageType | File)[],
    entityImage: GalleryImageType,
    entityId: number
  ): Promise<void>;
}
