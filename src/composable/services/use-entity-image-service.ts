import type { EntityImageService } from "@/interfaces/stores/entity-image-service";
import type { GalleryImageType } from "@/interfaces/types/gallery-image-type";

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

        if (newImage instanceof File) {
          const formData = new FormData();
          formData.append("imageFile", newImage);
          formData.append("model", JSON.stringify(baseImage));

          await api.update(`${entityImageUrl}/UpdateImageAndFile`, formData, {
            headers: { "Content-Type": "multipart/form-data" }
          });
          eventBus.emit(`on-${imageUrlKey.toLowerCase()}-gallery-image-updates`);
        } else if (baseImage.imagePath !== newImage.imagePath) {
          baseImage.imagePath = newImage.imagePath;
          await api.update(`${entityImageUrl}/UpdateImage`, baseImage);
        }
      }

      // Handle new items beyond upperBound
      for (let i = upperBound; i < updatedImages.length; i++) {
        const newImage = updatedImages[i];
        const ranking = i + 1;

        if (newImage instanceof File) {
          entityImage.ranking = ranking;
          const formData = new FormData();
          formData.append("imageFile", newImage);
          formData.append("model", JSON.stringify(entityImage));

          await api.create(`${entityImageUrl}/CreateImageAndFile`, formData, {
            headers: { "Content-Type": "multipart/form-data" }
          });
          eventBus.emit(`on-${imageUrlKey.toLowerCase()}-gallery-image-updates`);
        } else {
          newImage.ranking = ranking;
          await api.create(`${entityImageUrl}/CreateImage`, newImage);
        }
      }

      const deletedThreshold = Math.max(upperBound, updatedImages.length);
      await api.delete(`${entityImageUrl}/DeleteImagesAboveRank/${entityId}/${deletedThreshold}`);
    } catch (error: any) {
      console.error("Error updating gallery images:", error);
      notify(error, "negative");
      throw error;
    }
  }

  return {
    getGalleryImages,
    updateGalleryImages
  };
}