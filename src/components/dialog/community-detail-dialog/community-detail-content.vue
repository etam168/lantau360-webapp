<template>
  <q-page>
    <template v-for="(item, index) in renderItems" :key="index">
      <gallery-image-list v-if="item.type === 'carousel'" :image-list="galleryItems" />
      <contact-section v-else-if="item.type === 'contact'" :category />
      <description-section v-else-if="item.type === 'description'" :category />
    </template>
  </q-page>
</template>

<script setup lang="ts">
  // Interface files
  import type { CategoryTypes } from "@/interfaces/types/category-types";

  // .ts files
  import { EntityURLKey } from "@/constants";

  // UI Components
  import ContactSection from "./renderer/contact-section.vue";
  import DescriptionSection from "./renderer/description-section.vue";

  // Props
  const { category, entityKey } = defineProps<{
    category: CategoryTypes;
    entityKey: EntityURLKey;
  }>();

  // Composable function calls
  const { galleryItems, fetchAllData } = useCommunityDialogService(entityKey, category);

  interface RenderItem {
    name: string;
    hasCheckIn?: boolean;
    itemCount?: number;
    type: "carousel" | "description" | "contact";
  }

  const renderItems = computed((): RenderItem[] => {
    return [
      { name: "carousel", type: "carousel" },
      { name: "description", type: "description" }
    ];
  });

  /**
   * Fetch data as part of the setup
   * This ensures that the component is compatible with Suspense
   */
  await fetchAllData();
</script>
