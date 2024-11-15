<template>
  <q-page>
    <template v-for="(item, index) in renderItems" :key="index">
      <gallery-image-list v-if="item.type === 'carousel'" :image-list="galleryItems" />
      <contact-section v-else-if="item.type === 'contact'" :category />
      <description-section v-else-if="item.type === 'description'" :category />
      <expansion-description-section
        v-else-if="item.type === 'expansion-description'"
        :category
        :entityKey
      />
      <favourite-section v-else-if="item.type === 'favourite'" :category :entityKey />

      <location-section
        v-else-if="item.type === 'location'"
        :category
        :has-check-in="entityKey.includes('SITE')"
        @check-in="openCheckInDialog"
        @open-map="openGoogleMaps"
      />
      <open-close-time-section v-else-if="item.type === 'time'" :category />
      <promotion-section v-else-if="item.type === 'promotion'" :category />

      <timetable-section v-else-if="item.type === 'timetable'" :category :entityKey />
    </template>
  </q-page>
</template>

<script setup lang="ts">
  // Third party imports
  import { useUserStore } from "@/stores/user";

  // Interface files
  import type { CategoryTypes } from "@/interfaces/types/category-types";

  // .ts files
  import { RenderItem } from "@/composable/services/use-category-dialog-service";
  import { EntityURLKey, TEMPLATE, RENDERER } from "@/constants";

  // UI Components
  import ContactSection from "./renderer/contact-section.vue";
  import DescriptionSection from "./renderer/description-section.vue";
  import ExpansionDescriptionSection from "./renderer/expansion-description-section.vue";
  import FavouriteSection from "./renderer/favourite-section.vue";
  import LocationSection from "./renderer/location-section.vue";
  import OpenCloseTimeSection from "./renderer/open-close-time-section.vue";
  import promotionSection from "./renderer/promotion-section.vue";
  import TimetableSection from "./renderer/timetable-section.vue";

  // Props
  const { category, entityKey } = defineProps<{
    category: CategoryTypes;
    entityKey: EntityURLKey;
  }>();

  // Reactive variables
  const memberConfig = ref();
  const checkInData = ref();

  // Composable function calls
  const $q = useQuasar();
  const userStore = useUserStore();
  const { t } = useI18n({ useScope: "global" });
  const { notify } = useUtilities();
  const { galleryItems, fetchAllData } = useContentDetailDataService(category, entityKey);
  const { performCheckIn } = useCheckInDataService(memberConfig, checkInData);

  const openCheckInDialog = () => {
    // Check if the user is logged in
    const isLoggedIn = userStore.isUserLogon(); // This will return true or false
    switch (isLoggedIn) {
      case true:
        performCheckIn(entityKey, category);
        break;
      case false:
        // Notify the user to log in
        handleLoginAlert();
        break;
      default:
        // This case should not happen, but just in case
        console.error("Unexpected value for isLoggedIn");
        break;
    }
  };

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

  const openGoogleMaps = () => {
    if (category.meta?.["hasMap"]) {
      window.open(category.meta?.["mapLink"], "_blank");
    } else {
      notify(t("errors.mapLinkNotAvailable"), "negative");
    }
  };

  function handleLoginAlert() {
    $q.dialog({
      component: defineAsyncComponent(() => import("@/components/dialog/login-alert-dialog.vue")),
      componentProps: {
        mode: "login"
      }
    });
  }

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

  /**
   * Fetch data as part of the setup
   * This ensures that the component is compatible with Suspense
   */
  await fetchAllData();
</script>
