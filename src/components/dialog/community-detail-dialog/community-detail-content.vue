<template>
  <template v-for="(item, index) in renderItems" :key="index">
    <carousel-image-list
      v-if="item.type === 'carousel'"
      :gallery-items="galleryItems"
      :category="category"
    />
    <contact-section v-else-if="item.type === 'contact'" :category />
    <description-section v-else-if="item.type === 'description'" :category />
  </template>
</template>

<script setup lang="ts">
  // Interface files
  import type { CategoryTypes } from "@/interfaces/types/category-types";
  import type { GalleryImageType } from "@/interfaces/types/gallery-image-type";

  // .ts files
  import { ENTITY_URL, EntityURLKey } from "@/constants";
  import { RenderItem } from "@/composable/services/use-community-dialog-service";

  // UI Components
  import ContactSection from "./renderer/contact-section.vue";
  import DescriptionSection from "./renderer/description-section.vue";

  // Props
  const { category, entityKey } = defineProps<{
    category: CategoryTypes;
    entityKey: EntityURLKey;
  }>();

  // Composable function calls
  const { fetchData } = useApi();
  const { getEntityId, getEntityName } = useUtilities();

  const galleryItems = ref<GalleryImageType[]>([]);
  const renderItems = computed((): RenderItem[] => {
    return [
      { name: "carousel", type: "carousel" },
      { name: "description", type: "description" }
    ];
  });

  async function fetchAllData() {
    try {
      switch (entityKey) {
        case "COMMUNITY_EVENT":
        case "COMMUNITY_NOTICE":
        case "POSTING":
          const id = getEntityId(category, getEntityName(entityKey));
          const imageUrlKey = `${entityKey}_IMAGE` as EntityURLKey;
          const url = `${ENTITY_URL[imageUrlKey]}/GalleryImages/${id}`;

          galleryItems.value = await fetchData<GalleryImageType[]>(url);
          break;
        default:
          console.warn(`Unsupported entity type: ${entityKey}`);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      throw error;
    }
  }

  /**
   * Fetch data as part of the setup
   * This ensures that the component is compatible with Suspense
   */
  await fetchAllData();
</script>
