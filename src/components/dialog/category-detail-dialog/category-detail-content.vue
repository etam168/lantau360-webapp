<template>
  <q-page>
    <template v-for="(item, index) in renderItems" :key="index">
      <gallery-image-list v-if="item.type === 'carousel'" :image-list="galleryItems" />
      <contact-section v-else-if="item.type === 'contact'" :category />
      <description-section v-else-if="item.type === 'description'" :category />
      <expansion-description-section v-else-if="item.type === 'expansion-description'" :category />
      <favourite-section v-else-if="item.type === 'favourite'" :category />

      <location-section
        v-else-if="item.type === 'location'"
        :category
        :entityKey
        :has-check-in="true"
        @check-in="openCheckInDialog"
        @open-map="openGoogleMaps"
      />
      <promotion-section v-else-if="item.type === 'promotion'" :category />

      <timetable-section v-else-if="item.type === 'timetable'" :category />
    </template>
  </q-page>
</template>

<script setup lang="ts">
  // Interface files
  import { CategoryTypes } from "@/interfaces/types/category-types";
  import { GalleryImageType } from "@/interfaces/types/gallery-image-types";
  import { SiteView } from "@/interfaces/models/views/site-view";

  // .ts files
  import { EntityURLKey, TEMPLATE, URL, RENDERER } from "@/constants";

  // UI Components
  import ContactSection from "./renderer/contact-section.vue";
  import DescriptionSection from "./renderer/description-section.vue";
  import ExpansionDescriptionSection from "./renderer/expansion-description-section.vue";
  import FavouriteSection from "./renderer/favourite-section.vue";
  import LocationSection from "./renderer/location-section.vue";
  import promotionSection from "./renderer/promotion-section.vue";
  import TimetableSection from "./renderer/timetable-section.vue";

  // Props
  const { category, entityKey } = defineProps<{
    category: CategoryTypes;
    entityKey: EntityURLKey;
  }>();

  const $q = useQuasar();
  const { t } = useI18n({ useScope: "global" });
  const { notify } = useUtilities();

  const galleryItems = ref<GalleryImageType[]>([]);

  const fetchAllData = async () => {
    try {
      switch (entityKey) {
        case "SITE":
          await loadData(`${URL.SITE_GALLERY}/${(category as SiteView).siteId}`);
          break;
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
      | "expansion-description"
      | "description"
      | "favourite"
      | "location"
      | "contact"
      | "timetable"
      | "promotion";
  }

  const renderItems = computed((): RenderItem[] => {
    switch (template.value) {
      case RENDERER.ADVERTISEMENT:
        return [
          { name: "carousel", type: "carousel" },
          { name: "description", type: "description" }
        ];
      case RENDERER.ATM:
      case RENDERER.BUSINESS:
      case RENDERER.SITE:
        return [
          { name: "carousel", type: "carousel" },
          { name: "expansion-description", type: "expansion-description" },
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
      case RENDERER.EVENT:
        return [
          { name: "carousel", type: "carousel" },
          { name: "expansion-description", type: "expansion-description" }
        ];
      case RENDERER.POSTING:
        return [
          { name: "carousel", type: "carousel" },
          { name: "expansion-description", type: "expansion-description" }
        ];
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
    if ("advertisementId" in category) {
      return RENDERER.ADVERTISEMENT;
    }
    if ("businessVoucherId" in category) {
      return RENDERER.VOUCHER;
    }
    if ("businessPromotionId" in category) {
      return RENDERER.PROMOTION;
    }
    switch (category?.directoryTemplate) {
      case TEMPLATE.RESTAURANT.value:
        return RENDERER.RESTAURANT;
      case TEMPLATE.EVENT.value:
      case TEMPLATE.NEWS.value:
      case TEMPLATE.NOTICE.value:
        return RENDERER.EVENT;
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

  // Fetch data as part of the setup
  // This ensures that the component is compatible with Suspense
  await fetchAllData();
</script>
