<template>
  <q-page>
    <template v-for="(item, index) in renderItems" :key="index">
      <carousel-image-list v-if="item.type === 'carousel'" :image-list="galleryItems" />
      <contact-section v-else-if="item.type === 'contact'" :category />
      <description-section v-else-if="item.type === 'description'" :category />
      <favourite-section v-else-if="item.type === 'favourite'" :category :entityKey />
      <open-close-time-section v-else-if="item.type === 'time'" :category />
      <promotion-section v-else-if="item.type === 'promotion'" :category />
      <timetable-section v-else-if="item.type === 'timetable'" :category :entityKey />

      <expansion-description-section
        v-else-if="item.type === 'expansion-description'"
        :category
        :entityKey
      />

      <location-section
        v-else-if="item.type === 'location'"
        :category
        :has-check-in="entityKey.includes('SITE')"
        @check-in="requestCheckIn(category)"
        @open-map="openGoogleMaps(category)"
      />
    </template>
  </q-page>
</template>

<script setup lang="ts">
  // Interface files
  import type { CategoryTypes } from "@/interfaces/types/category-types";
  import type { BusinessView } from "@/interfaces/models/views/business-view";
  import type { SiteView } from "@/interfaces/models/views/site-view";

  // Constants
  import { EntityURLKey, TEMPLATE, RENDERER } from "@/constants";

  // Components
  import ContactSection from "./renderer/contact-section.vue";
  import DescriptionSection from "./renderer/description-section.vue";
  import ExpansionDescriptionSection from "./renderer/expansion-description-section.vue";
  import FavouriteSection from "./renderer/favourite-section.vue";
  import LocationSection from "./renderer/location-section.vue";
  import OpenCloseTimeSection from "./renderer/open-close-time-section.vue";
  import PromotionSection from "./renderer/promotion-section.vue";
  import TimetableSection from "./renderer/timetable-section.vue";

  // Props
  const { category, entityKey } = defineProps<{
    category: CategoryTypes;
    entityKey: EntityURLKey;
  }>();

  interface RenderItem {
    name: string;
    hasCheckIn?: boolean;
    itemCount?: number;
    type:
      | "carousel"
      | "gallery"
      | "expansion-description"
      | "description"
      | "favourite"
      | "location"
      | "contact"
      | "timetable"
      | "time"
      | "promotion";
  }

  const { galleryItems, fetchAllData } = useCategoryDialogService(entityKey, category);
  const { requestCheckIn } = useCheckInDataService();
  const { openGoogleMaps } = useCategoryDialogService(entityKey);

  const renderItems = computed((): RenderItem[] => {
    switch (template.value) {
      case RENDERER.ADVERTISEMENT:
        return [
          { name: "carousel", type: "carousel" },
          { name: "description", type: "description" }
        ];
      case RENDERER.ATM:
      case RENDERER.SITE:
        return [
          { name: "carousel", type: "carousel" },
          { name: "expansion-description", type: "expansion-description" },
          { name: "location", type: "location" },
          { name: "contact", type: "contact" }
        ];
      case RENDERER.BUSINESS:
        return [
          { name: "carousel", type: "carousel" },
          { name: "time", type: "time" },
          { name: "expansion-description", type: "expansion-description" },
          { name: "location", type: "location" },
          { name: "contact", type: "contact" }
        ];
      case RENDERER.DAYTRIP:
        return [{ name: "carousel", type: "carousel" }];
      case RENDERER.EMERGENCY:
        return [{ name: "contact", type: "contact" }];
      case RENDERER.PROMOTION:
        return [
          { name: "carousel", type: "carousel" },
          { name: "promotion", type: "promotion" }
        ];
      case RENDERER.TAXI:
        return [
          { name: "carousel", type: "carousel" },
          { name: "favourite", type: "favourite" }
        ];
      case RENDERER.TIMETABLE:
        return [{ name: "timetable", type: "timetable" }];
      default:
        return [];
    }
  });

  const template = computed(() => {
    switch (entityKey) {
      case "ADVERTISEMENT":
        return RENDERER.ADVERTISEMENT;
      case "BUSINESS":
        return getBusinessTemplate();
      case "BUSINESS_PROMOTION":
        return RENDERER.PROMOTION;
      case "BUSINESS_VOUCHER":
        return RENDERER.VOUCHER;
      case "SITE":
        return getSiteTemplate();
      default:
        return "";
    }
  });

  function getBusinessTemplate() {
    // we only need to process BusinessView data here
    switch ((category as BusinessView).directoryTemplate) {
      case TEMPLATE.RESTAURANT.value:
        return RENDERER.RESTAURANT;
      default:
        return RENDERER.BUSINESS;
    }
  }

  function getSiteTemplate() {
    // we only need to process SiteView data here
    switch ((category as SiteView).directoryTemplate) {
      case TEMPLATE.ATM.value:
        return RENDERER.ATM;
      case TEMPLATE.TIMETABLE.value:
        return RENDERER.TIMETABLE;
      case TEMPLATE.TAXI.value:
        return RENDERER.TAXI;
      case TEMPLATE.EMERGENCY.value:
        return RENDERER.EMERGENCY;
      default:
        return RENDERER.SITE;
    }
  }

  /**
   * Fetch data as part of the setup
   * This ensures that the component is compatible with Suspense
   */
  await fetchAllData();
</script>
