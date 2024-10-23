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
  import { useGeolocation } from "@vueuse/core";
  import * as geolib from "geolib";

  // Interface files
  import { CategoryTypes } from "@/interfaces/types/category-types";
  import { GalleryImageType } from "@/interfaces/types/gallery-image-types";
  import { SiteView } from "@/interfaces/models/views/site-view";
  import { useUserStore } from "@/stores/user";
  import { CheckIn } from "@/interfaces/models/entities/checkin";
  import { Content } from "@/interfaces/models/entities/content";

  // .ts files
  import { EntityURLKey, ENTITY_URL, TEMPLATE, URL, RENDERER } from "@/constants";

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

  const { coords: userLocation, isSupported, error: locationError } = useGeolocation();
  const { handleOpenDialog } = useEntityDataHandlingService();
  const $q = useQuasar();
  const { t } = useI18n({ useScope: "global" });
  const { notify } = useUtilities();
  const userStore = useUserStore();
  const { fetchData } = useApi();

  const memberConfig = ref();
  const checkInData = ref();
  const distanceToDestination = ref(0);
  const timeUntilNextCheckIn = ref();

  const galleryItems = ref<GalleryImageType[]>([]);

  const fetchAllData = async () => {
    try {
      switch (entityKey) {
        case "SITE":
          await loadData(`${URL.SITE_GALLERY}/${(category as SiteView).siteId}`);
          if (userStore.isUserLogon()) {
            await loadMemberCheckInDetail();
          }
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

  async function loadMemberCheckInDetail() {
    try {
      const [memberConfigRes, checkInDataRes] = await Promise.all([
        fetchData<Content>(URL.MEMBER_CONFIG),
        fetchData<CheckIn>(
          `${ENTITY_URL.MEMBER_SITE_CHECK_IN}/${userStore.userId}/${(category as SiteView).siteId}`
        )
      ]);

      memberConfig.value = memberConfigRes;
      checkInData.value = checkInDataRes;
    } catch (error) {
      console.error("Error fetching data:", error);
      throw error;
    }
  }

  // async function PerformCheckIn() {
  //   await checkRecentCheckInStatus();

  //   if (timeUntilNextCheckIn.value > 0) {
  //     $q.notify({
  //       message: `You must wait ${timeUntilNextCheckIn.value} minutes before checking in again.`,
  //       color: "primary",
  //       multiLine: true
  //     });
  //     return; // Exit if the user can't check in yet
  //   }

  //   await getDistanceToDestination();
  //   if (distanceToDestination.value > 100) {
  //     $q.notify({
  //       message: "You must be under 100 meters of location for checkin",
  //       color: "primary",
  //       multiLine: true
  //     });
  //   } else {
  //     $q.dialog({
  //       component: defineAsyncComponent(
  //         () => import("@/components/dialog/check-in-items-dialog/index.vue")
  //       ),
  //       componentProps: {
  //         category: category,
  //         entityKey: entityKey
  //       }
  //     });
  //   }
  // }

  async function getDistanceToDestination() {
    const { latitude: siteLatitude, longitude: siteLongitude } = category;
    const sourceCoords = {
      latitude: userLocation.value.latitude,
      longitude: userLocation.value.longitude
    };
    const destinationCoords = { latitude: siteLatitude, longitude: siteLongitude };

    distanceToDestination.value = await geolib.getDistance(sourceCoords, destinationCoords);
  }

  async function checkRecentCheckInStatus() {
    try {
      const config = memberConfig;
      const checkIn = checkInData;

      const configTimeDifferenceInHours = config?.value.meta?.checkInTimeDifferenceInHours ?? 1;
      const configTimeDifferenceInMinutes = configTimeDifferenceInHours * 60;

      const checkInModifiedAt = checkIn?.value.modifiedAt
        ? new Date(checkIn.value.modifiedAt).getTime()
        : 0;
      const currentTime = new Date().getTime();
      const timeDifferenceInMilliseconds = currentTime - checkInModifiedAt;
      const timeDifferenceInMinutes = Math.abs(timeDifferenceInMilliseconds / (1000 * 60));

      const minutesLeftToRecheckIn = configTimeDifferenceInMinutes - timeDifferenceInMinutes;

      if (minutesLeftToRecheckIn >= 0) {
        timeUntilNextCheckIn.value = 0; // or null, or some other indicator that they can post now
      } else {
        timeUntilNextCheckIn.value = Math.ceil(minutesLeftToRecheckIn); // Round up to the nearest minute
      }
    } catch (err) {}
  }

  const openCheckInDialog = () => {
    // Check if the user is logged in
    const isLoggedIn = userStore.isUserLogon(); // This will return true or false

    switch (isLoggedIn) {
      case true:
        // PerformCheckIn();
        handleCheckIn();
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

  function handleCheckIn() {
    const isDialogOpen = ref(false);
    const props = { entityId: category.siteId, entityKey: entityKey };

    handleOpenDialog(props, isDialogOpen.value, ["CHECKIN"], "CHECKIN");
  }

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
