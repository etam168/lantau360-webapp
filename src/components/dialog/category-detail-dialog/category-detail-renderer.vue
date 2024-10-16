<template>
  <template v-for="(item, index) in renderItems" :key="index">
    <gallery-image-list v-if="item.type === 'carousel'" :image-list="galleryItems" />
    <contact-section v-else-if="item.type === 'contact'" :item="category" />
    <description-section v-else-if="item.type === 'description'" :item="category" />
    <favourite-section v-else-if="item.type === 'favourite'" :item="category" />

    <location-section
      v-else-if="item.type === 'location'"
      :category
      :entity-key
      :has-check-in="true"
      @check-in="openCheckInDialog"
      @open-map="openGoogleMaps"
    />

    <subtitle-favourite-section v-else-if="item.type === 'subtitle-favourite'" :item="category" />

    <timetable-image-section
      v-else-if="item.type === 'imagePath' || 'bannerPath'"
      :item="category"
      :type="item.type"
    />
  </template>
</template>

<script setup lang="ts">
  // Interface files
  import type { CategoryTypes } from "@/interfaces/types/category-types";
  import type { GalleryImageType } from "@/interfaces/types/gallery-image-types";

  // UI Components
  import ContactSection from "./renderer/contact-section.vue";
  import DescriptionSection from "./renderer/description-section.vue";
  import FavouriteSection from "./renderer/favourite-section.vue";
  import LocationSection from "./renderer/location-section.vue";
  import SubtitleFavouriteSection from "./renderer/subtitle-favourite-section.vue";
  import TimetableImageSection from "./renderer/timetable-image-section.vue";

  import { EntityURLKey, RENDERER, TEMPLATE } from "@/constants";

  // Props
  const { category, entityKey, galleryItems } = defineProps<{
    category: CategoryTypes;
    entityKey: EntityURLKey;
    galleryItems: GalleryImageType[];
  }>();

  const $q = useQuasar();
  const { t } = useI18n({ useScope: "global" });
  const { notify } = useUtilities();

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
    hasCheckIn?: boolean;
    itemCount?: number;
    type:
      | "carousel"
      | "gallery"
      | "description"
      | "favourite"
      | "location"
      | "contact"
      | "subtitle-favourite"
      | "bannerPath"
      | "imagePath";
  }

  const renderItems = computed((): RenderItem[] => {
    switch (template.value) {
      case RENDERER.ATM:
      case RENDERER.BUSINESS:
      case RENDERER.SITE:
        return [
          { name: "carousel", type: "carousel" },
          { name: "description", type: "description" },
          { name: "location", type: "location" },
          { name: "contact", type: "contact" }
        ];
      case RENDERER.DAYTRIP:
        return [{ name: "carousel", type: "carousel" }];
      case RENDERER.EMERGENCY:
        return [
          { name: "carousel", type: "carousel" },
          { name: "favourite", type: "favourite" }
        ];
      case RENDERER.POSTING:
        return [
          { name: "carousel", type: "carousel" },
          { name: "description", type: "description" }
        ];
      case RENDERER.TAXI:
        return [
          { name: "carousel", type: "carousel" },
          { name: "favourite", type: "favourite" }
        ];
      case RENDERER.TIMETABLE:
        return [
          { name: "subtitle-favourite", type: "subtitle-favourite" },
          { name: "bannerPath", type: "bannerPath" },
          { name: "subtitle-favourite", type: "subtitle-favourite" },
          { name: "imagePath", type: "imagePath" }
        ];
      default:
        return [];
    }
  });

  const openGoogleMaps = () => {
    if (category.meta?.["hasMap"]) {
      window.open(category.meta?.["mapLink"], "_blank");
    } else {
      notify(t("errors.mapLinkNotAvailable"), "negative");
    }
  };

  function getSiteTemplate() {
    switch (category?.directoryTemplate) {
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

  function getBusinessTemplate() {
    switch (category?.directoryTemplate) {
      case TEMPLATE.RESTAURANT.value:
        return RENDERER.RESTAURANT;
      default:
        return RENDERER.BUSINESS;
    }
  }

  const template = computed(() => {
    switch (entityKey) {
      case "POSTING":
        return RENDERER.POSTING;
      case "BUSINESS":
        return getBusinessTemplate();
      case "SITE":
        return getSiteTemplate();
      default:
        return "";
    }
  });
</script>
