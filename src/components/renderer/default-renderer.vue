<template>
  <gallery-image-list :image-list="galleryItems" />

  <q-list class="q-pa-md" style="background-color: #f6f6f6">
    <q-list class="rounded-borders">
      <div>item</div>
      <!-- Description section -->
      <!-- <description-section
        :descriptionContent="translate(siteItem.description, siteItem.meta, 'description')"
        :item="item"
      /> -->

      <!-- Location section -->
      <!-- <location-section
        :item="item"
        :can-check-in="true"
        @check-in="openCheckInDialog"
        :default-tooltip="translate(siteItem.siteName, siteItem.meta, 'siteName')"
        @open-map="openGoogleMaps"
      /> -->

      <!-- Contact section -->
      <!-- <contact-section :item="item" /> -->
    </q-list>
  </q-list>
</template>

<script setup lang="ts">
  // Interface files
  import { CategoryTypes } from "@/interfaces/types/category-types";

  // UI Components
  import GallerySection from "@/components/dialog/renderer/common/gallery-section.vue";
  import { EntityURLKey } from "@/constants";
import { GalleryImageType } from "@/interfaces/types/gallery-image-types";

  // Props
  const { category, entityKey , galleryItems } = defineProps<{
    category: CategoryTypes;
    entityKey: EntityURLKey;
    galleryItems: GalleryImageType[];
  }>();

  const $q = useQuasar();
  const { t } = useI18n({ useScope: "global" });
  const { notify, translate } = useUtilities();

  const openCheckInDialog = () => {
    $q.dialog({
      component: defineAsyncComponent(() => import("@/components/dialog/check-in/index.vue")),
      componentProps: {
        item: category
      }
    });
  };
</script>
