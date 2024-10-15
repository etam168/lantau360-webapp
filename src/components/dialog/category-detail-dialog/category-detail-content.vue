<template>
  <q-page>
    <default-renderer :category :entityKey :galleryItems/>
  </q-page>
</template>  

<script setup lang="ts">
  // Interface files
  import { CategoryTypes } from "@/interfaces/types/category-types";
  import { GalleryImageType } from "@/interfaces/types/gallery-image-types";

  // .ts files
  import { EntityURLKey, RENDERER, TEMPLATE, URL } from "@/constants";

  // Custom Components
  import DefaultRenderer from "@/components/renderer/default-renderer.vue";
  import { SiteView } from "@/interfaces/models/views/site-view";

  // Props
  const { category, entityKey } = defineProps<{
    category: CategoryTypes;
    entityKey: EntityURLKey;
  }>();

  const galleryItems = ref<GalleryImageType[]>([]);

  /**
   * Fetches all required data concurrently
   * Populates the reactive variables with the fetched data
   */
  const fetchAllData = async () => {
    try {
      switch (entityKey) {
        case "SITE":
          await loadData(`${URL.SITE_GALLERY}/${(category as SiteView).siteId}`);
        default:
          console.warn(`Unsupported entity type: ${entityKey}`);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      throw error;
    }
  };

  function getMaskValue(templateValue: number, meta?: any) {
    for (const make in TEMPLATE) {
      if (TEMPLATE[make as keyof typeof TEMPLATE].value === templateValue) {
        const modifier = meta?.["hasMap"] === true ? 2 : 0;
        return TEMPLATE[make as keyof typeof TEMPLATE].mask + modifier;
      }
    }
    return 0;
  }

  async function loadData(galleryUrl: string) {
    if (galleryUrl) {
      try {
        const [galleryResponse] = await Promise.all([axios.get<GalleryImageType[]>(galleryUrl)]);

        const maskValue = getMaskValue(category.directoryTemplate || 0);
        galleryItems.value = galleryResponse.data
          .filter(element => !((maskValue >> (element.ranking - 1)) & 1))
          .sort((a, b) => a.ranking - b.ranking);
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    }
  }

  /**
   * Fetch data as part of the setup
   * This ensures that the component is compatible with Suspense
   */
  await fetchAllData();
</script>
