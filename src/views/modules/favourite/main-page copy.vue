<template>
  <q-page>
    <app-bar-title :title="$t(`${i18nKey}.advertisement`)" />
    <app-carousel-section :data="advertisements" @image-click="onImageClick" />

    <q-separator size="4px" color="primary" />

    <!-- <q-scroll-area v-if="$q.screen.height - usedHeight > THRESHOLD" :style="scrollAreaStyle">
      <main-content
        :i18n-key="i18nKey"
        :site-items="siteItems"
        :business-items="businessItems"
        :check-ins="checkIns"
        @update:current-tab="setTab"
        @on-category-detail="onCategoryDetail"
      />
    </q-scroll-area> -->

    <main-content
      :i18n-key="i18nKey"
      :site-items="siteItems"
      :business-items="businessItems"
      :check-ins="checkIns"
      @update:current-tab="setTab"
      @on-category-detail="onCategoryDetail"
    />
  </q-page>
</template>

<script setup lang="ts">
  // Interface files
  import type { AdvertisementView } from "@/interfaces/models/views/advertisement-view";
  import type { BusinessView } from "@/interfaces/models/views/business-view";
  import type { CheckIn } from "@/interfaces/models/entities/checkin";
  import type { SiteView } from "@/interfaces/models/views/site-view";

  // Custom Components
  const mainContent = defineAsyncComponent(() => import("./components/main-content.vue"));

  // Constants
  import { EntityURLKey, ENTITY_URL } from "@/constants";

  // Composables
  import { useUserStore } from "@/stores/user";
  import { useFavoriteStore } from "@/stores/favorite-store";

  // Props
  const { entityKey } = defineProps<{
    entityKey: EntityURLKey;
  }>();

  const userStore = useUserStore();
  const favStore = useFavoriteStore();
  const $q = useQuasar();
  const { t } = useI18n({ useScope: "global" });
  const { fetchData } = useApi();
  const { openCategoryDetailDialog } = useCategoryDialogService(entityKey);
  const { eventBus, getEntityName } = useUtilities();

  const THRESHOLD = 320;
  const advertisements = ref<any | null>(null);
  const siteItems = computed<SiteView[]>(() => favStore.favoriteSites);
  const businessItems = computed<BusinessView[]>(() => favStore.favoriteBusinesses);
  const error = ref<string | null>(null);

  const setTab = (val: string) => (tab.value = val);
  const tab = ref("location");
  const i18nKey = getEntityName(entityKey);

  const isDialogOpen = ref(false);

  const usedHeight = computed(() => {
    const width = Math.min($q.screen.width, 1024);
    const carouselHeight = (width * 9) / 16; // Height for the carousel
    return carouselHeight + 105;
  });

  const scrollAreaStyle = computed(() => {
    return { height: `calc(100vh - ${usedHeight.value}px)` };
  });

  const checkIns: Ref<CheckIn[]> = ref([]);

  async function fetchAllData() {
    try {
      const [advertisementResponse] = await Promise.all([fetchData(ENTITY_URL.ADVERTISEMENT)]);
      advertisements.value = advertisementResponse;

      advertisements.value = advertisementResponse.filter(
        (adv: AdvertisementView) => adv.status === 1
      );

      if (userStore.isUserLogon()) {
        const isFavouriteSync = await favStore.isFavoritesInSync();
        if (!isFavouriteSync) promptUserDataSynAlert();
      }
    } catch (err) {
      handleError(err);
    }
  }

  function handleError(err: unknown) {
    if (err instanceof AxiosError) {
      error.value = err.response?.status === 404 ? t("errors.404") : t("errors.anErrorOccured");
    } else {
      error.value = t("errors.anErrorOccured");
    }
  }

  function promptUserDataSynAlert() {
    $q.dialog({
      component: defineAsyncComponent(() => import("./components/data-sync-alert-dialog.vue"))
    }).onOk(async (selectedOption: string) => {
      // Reset dialog state when it is dismissed/closed
      isDialogOpen.value = false;

      switch (selectedOption) {
        case "local":
          favStore.syncRemoteFromLocal();
          break;

        case "server":
          favStore.syncLocalFromRemote();
          break;

        default:
          console.warn(`Unhandled option: ${selectedOption}`);
      }
    });
  }

  const onImageClick = (category: AdvertisementView) => {
    const dialogName = "AdvertisementDetail";
    eventBus("DialogStatus").emit(true, dialogName);
    openCategoryDetailDialog(category, dialogName, "ADVERTISEMENT");
  };

  async function onCategoryDetail(item: any) {
    if (isDialogOpen.value) return;

    const dialogName = item.siteId ? "SITE_DETAIL_DIALOG" : "BUSINESS_DETAIL_DIALOG";
    const entityKey = item.siteId ? "SITE" : "BUSINESS";

    eventBus("DialogStatus").emit(true, dialogName);
    await openCategoryDetailDialog(item, dialogName, entityKey);
  }

  /**
   * Fetch data as part of the setup
   * This ensures that the component is compatible with Suspense
   */
  await fetchAllData();
</script>
