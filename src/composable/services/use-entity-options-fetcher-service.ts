// useEntityOptionsFetcherService.ts

// Constants
import { EntityURLKey } from "@/constants";
import { GalleryImageType } from "@/interfaces/types/gallery-image-type";

export function useEntityOptionsFetcherService() {
  const { getImageUrlKey } = useUtilities();

  // Utility function to create label-value objects

  async function fetchGalleryImages(entityKey: EntityURLKey, entityId: number) {
    const imageUrlKey = getImageUrlKey(entityKey);
    const { getGalleryImages } = useEntityImageService<GalleryImageType>(imageUrlKey);

    return await getGalleryImages(entityId);
  }

  return {
    fetchGalleryImages
  };
}
