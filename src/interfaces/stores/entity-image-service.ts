// @/interfaces/stores/entity-image-service.ts
import { GalleryImageType } from "../types/gallery-image-type";
import { ImageUploadPayload } from "../types//image-upload-payload";

export interface EntityImageService<T extends GalleryImageType> {
  createImage: (payload: ImageUploadPayload) => Promise<void>;
  deleteImage: (imageId: number) => Promise<void>;
  getGalleryImages: (entityId: number) => Promise<T[]>;
  updateImage: (payload: ImageUploadPayload) => Promise<void>;
  updateGalleryImages(
    images: (GalleryImageType | File)[],
    entityImage: GalleryImageType,
    entityId: number
  ): Promise<void>;
}
