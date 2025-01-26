import type { EntityImageService } from "@/interfaces/stores/entity-image-service";
import type { GalleryImageType } from "@/interfaces/types/gallery-image-type";
import type { ImageUploadPayload } from "@/interfaces/types/image-upload-payload";
import type { OperationMode } from "@/interfaces/types/operation-mode";

// External library imports
import { useChangeCase } from "@vueuse/integrations/useChangeCase";
import { eventBus } from "@/plugins/quasar/event-bus";

import i18n from "@/plugins/i18n/i18n";

// Internal constant imports
import { IMAGE_URL, ImageURLKey } from "@/constants";

export function useEntityImageService<T extends GalleryImageType>(
  imageUrlKey: ImageURLKey
): EntityImageService<T> {
  const { api, fetchData } = useApi();
  const { isDevelopment, notify } = useUtilities();
  const { t } = i18n.global;

  // Get the URL from the constants
  const entityImageUrl = IMAGE_URL[imageUrlKey];

  if (!entityImageUrl) {
    throw new Error(`No URL found for entity image type: ${imageUrlKey}`);
  }

  const entityName = useChangeCase(imageUrlKey, "camelCase").value;
  const entityIdKey = `${entityName}Id`;

  async function getGalleryImages(entityId: number): Promise<T[]> {
    const url = `${entityImageUrl}/GalleryImages/${entityId}`;

    try {
      const response = await api.get<T[]>(url);
      if (Array.isArray(response.data)) {
        return response.data;
      } else {
        throw new Error("Invalid response data format");
      }
    } catch (error: any) {
      if (isDevelopment) {
        console.error("Error getting gallery images:", error);
      }
      throw new Error(error || t(`${imageUrlKey.toLowerCase()}.message.loadImageError`));
    }
  }

  async function handleImageUpload(payload: ImageUploadPayload, mode: OperationMode) {
    // Validate input
    if (!payload.file || !(payload.file instanceof File)) {
      throw new Error("Invalid file provided");
    }

    if (!payload.imageData || typeof payload.imageData !== "object") {
      throw new Error("Invalid image data provided");
    }

    const formData = new FormData();
    formData.append("imageFile", payload.file);
    formData.append("model", JSON.stringify(payload.imageData));

    try {
      if (mode === "create") {
        await api.create(`${entityImageUrl}/CreateImageAndFile`, formData, {
          headers: { "Content-Type": "multipart/form-data" }
        });
      } else {
        await api.update(`${entityImageUrl}/UpdateImageAndFile`, formData, {
          headers: { "Content-Type": "multipart/form-data" }
        });
      }
      eventBus.emit(`on-${imageUrlKey.toLowerCase()}-gallery-image-updates`);
      // We can safely use type assertion here because we've checked for the existence of entityIdKey
      return (payload.imageData as any)[entityIdKey] as number;
    } catch (error: any) {
      console.error(`Error ${mode}ing image:`, error);
      notify(error, "negative");
      throw error;
    }
  }

  async function updateGalleryImages(
    updatedImages: (GalleryImageType | File)[],
    entityImage: GalleryImageType,
    entityId: number
  ): Promise<void> {
    try {
      const sortedImages = await fetchData<GalleryImageType[]>(
        `${entityImageUrl}/ReorderImagesRanking/${entityId}`
      );

      const upperBound = Math.min(sortedImages.length, updatedImages.length);

      for (let i = 0; i < upperBound; i++) {
        const baseImage = sortedImages[i];
        const newImage = updatedImages[i];

        switch (true) {
          case newImage instanceof File:
            await handleImageUpload({ file: newImage, imageData: baseImage }, "update");
            break;

          case baseImage.imagePath !== (newImage as GalleryImageType).imagePath:
            baseImage.imagePath = newImage.imagePath;
            await api.update(`${entityImageUrl}/UpdateImage`, baseImage);
            break;

          default:
          // Images are identical, skip update
        }
      }

      // Handle new items beyond upperBound
      for (let i = upperBound; i < updatedImages.length; i++) {
        const newImage = updatedImages[i];
        const ranking = i + 1;

        if (newImage instanceof File) {
          entityImage.ranking = ranking;
          await handleImageUpload({ file: newImage, imageData: entityImage }, "create");
        } else {
          newImage.ranking = ranking;
          await api.create(`${entityImageUrl}/CreateImage`, newImage);
        }
      }

      const deletedThreshold = Math.max(upperBound, updatedImages.length);

      await api.delete(`${entityImageUrl}/DeleteImagesAboveRank/${entityId}/${deletedThreshold}`);
    } catch (error: any) {}
  }

  return {
    getGalleryImages,
    updateGalleryImages
  };
}
