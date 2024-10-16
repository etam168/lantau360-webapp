<template>
  <q-page>
    <template v-for="(item, index) in renderItems" :key="index">
      <gallery-image-list v-if="item.type === 'carousel'" :image-list="galleryItems" />
      <contact-section v-else-if="item.type === 'contact'" :item="category" />
      <description-section v-else-if="item.type === 'description'" :item="category" />
      <favourite-section v-else-if="item.type === 'favourite'" :item="category" />

      <location-section
        v-else-if="item.type === 'location'"
        :category="category"
        :entity-key="entityKey"
        :has-check-in="true"
        @check-in="openCheckInDialog"
        @open-map="openGoogleMaps"
      />

      <subtitle-favourite-section v-else-if="item.type === 'subtitle-favourite'" :item="category" />

      <timetable-image-section
        v-else-if="item.type === 'imagePath' || item.type === 'bannerPath'"
        :item="category"
        :type="item.type"
      />
    </template>
  </q-page>
</template>

<script setup lang="ts">
  import { ref, computed, defineAsyncComponent } from "vue";
  import { useQuasar } from "quasar";
  import { useI18n } from "vue-i18n";
  import axios from "axios";

  // Interface files
  import { CategoryTypes } from "@/interfaces/types/category-types";
  import { GalleryImageType } from "@/interfaces/types/gallery-image-types";
  import { SiteView } from "@/interfaces/models/views/site-view";

  // .ts files
  import { EntityURLKey, TEMPLATE, URL, RENDERER } from "@/constants";

  // UI Components
  import ContactSection from "./renderer/contact-section.vue";
  import DescriptionSection from "./renderer/description-section.vue";
  import FavouriteSection from "./renderer/favourite-section.vue";
  import LocationSection from "./renderer/location-section.vue";
  import SubtitleFavouriteSection from "./renderer/subtitle-favourite-section.vue";
  import TimetableImageSection from "./renderer/timetable-image-section.vue";

  // Props
  const props = defineProps<{
    category: CategoryTypes;
    entityKey: EntityURLKey;
  }>();

  const $q = useQuasar();
  const { t } = useI18n({ useScope: "global" });
  const { notify } = useUtilities();

  const galleryItems = ref<GalleryImageType[]>([]);

  const fetchAllData = async () => {
    try {
      switch (props.entityKey) {
        case "SITE":
          await loadData(`${URL.SITE_GALLERY}/${(props.category as SiteView).siteId}`);
          break;
        default:
          console.warn(`Unsupported entity type: ${props.entityKey}`);
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

        const maskValue = getMaskValue(props.category.directoryTemplate || 0);
        galleryItems.value = galleryResponse.data
          .filter(element => !((maskValue >> (element.ranking - 1)) & 1))
          .sort((a, b) => a.ranking - b.ranking);
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    }
  }

  const openCheckInDialog = () => {
    $q.dialog({
      component: defineAsyncComponent(() => import("@/components/dialog/check-in/index.vue")),
      componentProps: {
        item: props.category
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
    if (props.category.meta?.["hasMap"]) {
      window.open(props.category.meta?.["mapLink"], "_blank");
    } else {
      notify(t("errors.mapLinkNotAvailable"), "negative");
    }
  };

  function getSiteTemplate() {
    switch (props.category?.directoryTemplate) {
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
    switch (props.category?.directoryTemplate) {
      case TEMPLATE.RESTAURANT.value:
        return RENDERER.RESTAURANT;
      default:
        return RENDERER.BUSINESS;
    }
  }

  const template = computed(() => {
    switch (props.entityKey) {
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

  // Fetch data as part of the setup
  // This ensures that the component is compatible with Suspense
  await fetchAllData();
</script>
