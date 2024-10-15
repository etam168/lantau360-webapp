<template>
  <template v-for="(item, index) in renderItems" :key="index">
    <gallery-image-list v-if="item.type === 'carousel'" :image-list="galleryItems" />
    <!-- <gallery-section v-else-if="item.type === 'gallery'" :item="category" /> -->
    <contact-section v-else-if="item.type === 'contact'" :item="category" />
    <description-section v-else-if="item.type === 'description'" :item="category" />
    <favourite-section v-else-if="item.type === 'favourite'" :item="category" />

    <location-section
      v-else-if="item.type === 'location'"
      :item="category"
      :can-check-in="true"
      @check-in="openCheckInDialog"
      :default-tooltip="translate(`${entityName}Name`, category.meta, `${entityName}Name`)"
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
  import { CategoryTypes } from "@/interfaces/types/category-types";

  // UI Components
  import ContactSection from "@/components/dialog/renderer/common/contact-section.vue";
  import DescriptionSection from "@/components/dialog/renderer/common/description-section.vue";
  import FavouriteSection from "@/components/dialog/renderer/common/favourite-section.vue";
  import GallerySection from "@/components/dialog/renderer/common/gallery-section.vue";
  import LocationSection from "@/components/dialog/renderer/common/location-section.vue";
  import SubtitleFavouriteSection from "@/components/dialog/renderer/common/subtitle-favourite-section.vue";
  import TimetableImageSection from "@/components/dialog/renderer/common/timetable-image-section.vue";
  import { EntityURLKey, RENDERER, TEMPLATE } from "@/constants";
  import { GalleryImageType } from "@/interfaces/types/gallery-image-types";

  // Props
  const { category, entityKey, galleryItems } = defineProps<{
    category: CategoryTypes;
    entityKey: EntityURLKey;
    galleryItems: GalleryImageType[];
  }>();

  const $q = useQuasar();
  const { t } = useI18n({ useScope: "global" });
  const { notify, translate, getEntityName, isBusinessView, isPostingView, isSiteView } =
    useUtilities();

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

  const template = computed(() => {
    const directoryTemplate = category.directoryTemplate;
    switch (true) {
      case directoryTemplate == TEMPLATE.ATM.value:
        return RENDERER.ATM;
      case directoryTemplate == TEMPLATE.TIMETABLE.value:
        return RENDERER.TIMETABLE;
      case directoryTemplate == TEMPLATE.TAXI.value:
        return RENDERER.TAXI;
      case directoryTemplate == TEMPLATE.RESTAURANT.value:
        return RENDERER.RESTAURANT;
      case directoryTemplate == TEMPLATE.EMERGENCY.value:
      case directoryTemplate == TEMPLATE.PROPERTY.value:
      case directoryTemplate == TEMPLATE.TUITION.value:
        return RENDERER.EMERGENCY;
      case isSiteView(category):
        return RENDERER.SITE;
      case isBusinessView(category):
        return RENDERER.BUSINESS;
      case isPostingView(category):
        return RENDERER.POSTING;
      default:
        return "";
    }
  });
</script>
