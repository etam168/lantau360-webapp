import type { EntityImageService } from "@/interfaces/stores/entity-image-service";
import type { GalleryImageType } from "@/interfaces/types/gallery-image-type";
import type { ImageUploadPayload } from "@/interfaces/types/image-upload-payload";
import type { OperationMode } from "@/interfaces/types/operation-mode";

// External library imports
import { useChangeCase } from "@vueuse/integrations/useChangeCase";

import i18n from "@/plugins/i18n/i18n";

// Internal constant imports
import { IMAGE_URL, ImageURLKey } from "@/constants";

export function useEntityImageService<T extends GalleryImageType>(
  imageUrlKey: ImageURLKey
): EntityImageService<T> {
  const { api } = useApi();
  const { isDevelopment, notify, eventBus } = useUtilities();
  const { t } = i18n.global;

  // Get the URL from the constants
  const entityImageUrl = IMAGE_URL[imageUrlKey];

  if (!entityImageUrl) {
    throw new Error(`No URL found for entity image type: ${imageUrlKey}`);
  }

  const entityName = useChangeCase(imageUrlKey, "camelCase").value;
  const entityIdKey = `${entityName}Id`;

  async function deleteImage(imageId: number) {
    const url = `${entityImageUrl}/${imageId}`;

    try {
      await api.delete(url);
      eventBus(`on-${imageUrlKey.toLowerCase()}-gallery-image-updates`).emit();
    } catch (error: any) {
      if (isDevelopment) {
        console.error("Error deleting image:", error);
      }
      notify(error, "negative");
    }
  }

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
        await api.create(entityImageUrl, formData, {
          headers: { "Content-Type": "multipart/form-data" }
        });
      } else {
        await api.update(entityImageUrl, formData, {
          headers: { "Content-Type": "multipart/form-data" }
        });
      }

      eventBus(`on-${imageUrlKey.toLowerCase()}-gallery-image-updates`).emit();

      // We can safely use type assertion here because we've checked for the existence of entityIdKey
      return (payload.imageData as any)[entityIdKey] as number;
    } catch (error: any) {
      console.error(`Error ${mode}ing image:`, error);
      notify(error, "negative");
      throw error;
    }
  }

  async function createImage(payload: ImageUploadPayload) {
    const entityId = await handleImageUpload(payload, "create");
    if (entityId) {
      await getGalleryImages(entityId);
    }
  }

  async function updateImage(payload: ImageUploadPayload) {
    const entityId = await handleImageUpload(payload, "update");
    if (entityId) {
      await getGalleryImages(entityId);
    }
  }

  const resequenceRankings = async (entityId: any) => {
    try {
      const imageList = await api.get(`${entityImageUrl}/ReorderImagesRanking/${entityId}`);
      return imageList.data as GalleryImageType[];
    } catch (error: any) {
      notify(error, "negative");
    }
  };

  async function updateGalleryImages(
    updatedImages: (GalleryImageType | File)[],
    entityImage: GalleryImageType,
    entityId: number
  ): Promise<void> {
    const sortedImages = await resequenceRankings(entityId);

    if (!sortedImages) {
      return;
    }

    // New List has more or equal elements
    if (sortedImages.length <= updatedImages.length) {
      for (let i = 0; i < sortedImages.length; i++) {
        // Update image ranking if needed
        const backendImage = sortedImages[i];
        const newImage = updatedImages[i];
        const newRanking = i + 1;

        if (newImage instanceof File) {
          await updateImage({ file: newImage, imageData: backendImage });
        } else {
          if (backendImage.imagePath != newImage.imagePath) {
            backendImage.ranking = newRanking;
            backendImage.imagePath = newImage.imagePath;
            await api.update(`${entityImageUrl}/UpdateImage`, backendImage);
          }
        }
      }

      for (let i = sortedImages.length; i < updatedImages.length; i++) {
        // Insert image record(s)
        const newImage = updatedImages[i];
        const newRanking = i + 1;

        if (newImage instanceof File) {
          entityImage.ranking = newRanking;
          await createImage({ file: newImage, imageData: entityImage });
        } else {
          entityImage.imagePath = newImage.imagePath;
          await api.create(`${entityImageUrl}/CreateImage`, entityImage);
        }
      }
    } else {
      // New List has less elements
      for (let i = 0; i < updatedImages.length; i++) {
        // Update image ranking if needed
        const backendImage = sortedImages[i];
        const newImage = updatedImages[i];

        if (newImage instanceof File) {
          await updateImage({ file: newImage, imageData: backendImage });
        } else {
          if (backendImage.imagePath != newImage.imagePath) {
            // backendImage.ranking = i + 1;
            backendImage.imagePath = newImage.imagePath;
            await api.update(`${entityImageUrl}/UpdateImage`, backendImage);
          }
        }
      }

      for (let i = updatedImages.length; i < sortedImages.length; i++) {
        // Delete iamge record
        await deleteImage(sortedImages[i].imageId);
      }
    }
  }

  return {
    createImage,
    getGalleryImages,
    deleteImage,
    updateImage,
    updateGalleryImages
  };
}
