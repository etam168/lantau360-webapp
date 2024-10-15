<template>
  <template v-for="(item, index) in renderItems" :key="index">
    <gallery-image-list v-if="item.type === 'carousel'" :image-list="galleryItems" />
    <!-- <gallery-section v-else-if="item.type === 'gallery'" :item="category" /> -->
    <description-section v-else-if="item.type === 'description'" :item="category" />

    <location-section
      v-else-if="item.type === 'location'"
      :item="category"
      :can-check-in="true"
      @check-in="openCheckInDialog"
      :default-tooltip="
        translate(`${category[entityName]}Name`, category.meta, `${category[entityName]}Name`)
      "
      @open-map="openGoogleMaps"
    />
    <contact-section v-else-if="item.type === 'contact'" :item="category" />
  </template>
</template>

<script setup lang="ts">
  // Interface files
  import { CategoryTypes } from "@/interfaces/types/category-types";

  // UI Components
  import ContactSection from "@/components/dialog/renderer/common/contact-section.vue";
  import DescriptionSection from "@/components/dialog/renderer/common/description-section.vue";
  import GallerySection from "@/components/dialog/renderer/common/gallery-section.vue";
  import LocationSection from "@/components/dialog/renderer/common/location-section.vue";
  import { EntityURLKey } from "@/constants";
  import { GalleryImageType } from "@/interfaces/types/gallery-image-types";

  // Props
  const { category, entityKey, galleryItems } = defineProps<{
    category: CategoryTypes;
    entityKey: EntityURLKey;
    galleryItems: GalleryImageType[];
  }>();

  const $q = useQuasar();
  const { t } = useI18n({ useScope: "global" });
  const { notify, translate, getEntityName } = useUtilities();

  const entityName = getEntityName(entityKey);

  const openCheckInDialog = () => {
    $q.dialog({
      component: defineAsyncComponent(() => import("@/components/dialog/check-in/index.vue")),
      componentProps: {
        item: category
      }
    });
  };

  interface RenderItem {
    name: string;
    itemCount?: number;
    type: "carousel" | "gallery" | "description" | "location" | "contact";
  }

  const renderItems = computed((): RenderItem[] => {
    switch (entityKey) {
      case "BUSINESS":
        return [
          { name: "carousel", type: "carousel" },
          { name: "description", type: "description" },
          { name: "location", type: "location" },
          { name: "contact", type: "contact" }
        ];
      case "COMMUNITY":
        return [{ name: "carousel", type: "carousel" }];
      case "FAVOURITE":
        return [{ name: "carousel", type: "carousel" }];
      case "SITE":
        return [
          { name: "carousel", type: "carousel" },
          { name: "description", type: "description" },
          { name: "location", type: "location" },
          { name: "contact", type: "contact" }
        ];
      default:
        return [];
    }
  });
</script>
