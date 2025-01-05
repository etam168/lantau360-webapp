<template>
  <app-bar-title :title="$t(`${i18nKey}.advertisement`)" />
  <app-carousel-section :data="advertisements" @image-click="onImageClick" />

  <q-separator size="4px" color="primary" />

  <!-- Merged main-content template -->
  <q-banner :inline-actions="!isSmallScreen">
    <q-toolbar-title :class="titleClass">{{ contentTitle }}</q-toolbar-title>

    <template v-slot:action>
      <app-tab-select
        :tab-items="tabItems"
        :current-tab="tab"
        @update:currentTab="setTab"
        :class="$q.screen.lt.sm ? 'justify-center' : ''"
      />
    </template>
  </q-banner>

  <q-tab-panels v-model="tab">
    <q-tab-panel name="location" class="q-pa-none">
      <app-category-list-items
        :categoryItems="siteItems"
        :entityKey="'SITE'"
        :pageName="'FAVOURITE'"
        @on-category-detail="onCategoryDetail"
        :style="tableStyle" 
      />
    </q-tab-panel>

    <q-tab-panel name="business" class="q-pa-none">
      <app-category-list-items
        :categoryItems="businessItems"
        :entityKey="'BUSINESS'"
        :pageName="'FAVOURITE'"
        @on-category-detail="onCategoryDetail"
        :style="tableStyle" 
      />
    </q-tab-panel>

    <q-tab-panel name="checkIn" class="q-pa-none">
      <app-checkin-list-items :style="tableStyle" i18n-key="favourite.checkIn" />
    </q-tab-panel>
  </q-tab-panels>
</template>

<script setup lang="ts">
  // Interface files
  import type { AdvertisementView } from "@/interfaces/models/views/advertisement-view";
  import type { CheckInView } from "@/interfaces/models/views/checkin-view";
  import type { TabItem } from "@/interfaces/tab-item";
  import type { SiteView } from "@/interfaces/models/views/site-view";
  import type { BusinessView } from "@/interfaces/models/views/business-view";

  // Constants
  import { EntityURLKey, ENTITY_URL, MAX_SCREEN_WIDTH } from "@/constants";

  // Composables
  import { useUserStore } from "@/stores/user";
  import { useFavoriteStore } from "@/stores/favorite-store";
  import { useCheckInStore } from "@/stores/checkin-store";

  const { entityKey } = defineProps<{
    entityKey: EntityURLKey;
  }>();

  const userStore = useUserStore();
  const favStore = useFavoriteStore();
  const checkInStore = useCheckInStore();

  const $q = useQuasar();
  const { t } = useI18n({ useScope: "global" });
  const { fetchData } = useApi();
  const { openCategoryDetailDialog } = useCategoryDialogService(entityKey);
  const { eventBus, getEntityName, isSmallScreen, aspectRatio } = useUtilities();

  const advertisements = ref<any | null>(null);
  const error = ref<string | null>(null);
  const i18nKey = getEntityName(entityKey);
  const isDialogOpen = ref(false);

  const siteItems = computed<SiteView[]>(() => favStore.favoriteSites);
  const businessItems = computed<BusinessView[]>(() => favStore.favoriteBusinesses);
  const checkinItems = computed<CheckInView[]>(() => checkInStore.checkInSites);

  const titleClass = computed(() => (isSmallScreen.value ? "text-center" : ""));
  const tab = ref("location");

  const tabItems = ref<TabItem[]>([
    { name: "location", label: t(`${i18nKey}.tabItem.location`) },
    { name: "business", label: t(`${i18nKey}.tabItem.business`) },
    { name: "checkIn", label: t(`${i18nKey}.tabItem.checkIn`) }
  ]);

  const setTab = (val: string) => (tab.value = val);

  const contentTitle = computed(() => {
    const baseTitle = t(`${i18nKey}.title`);
    return userStore.isUserLogon() ? baseTitle : `${baseTitle} (Offline)`;
  });

  const THRESHOLD = 320 as const;

  const usedHeight = computed(() => {
    const ADDITIONAL_HEIGHT = 160 as const;
    const width = Math.min($q.screen.width, MAX_SCREEN_WIDTH);
    const carouselHeigh = width * aspectRatio();

    return carouselHeigh + ADDITIONAL_HEIGHT;
  });

  const tableStyle = computed<Record<string, any> | undefined>(() => {
    const height = $q.screen.height - usedHeight.value;
    return height > THRESHOLD ? { height: `calc(100vh - ${usedHeight.value}px)` } : undefined;
  });

  async function fetchAllData() {
    try {
      const [advertisementResponse] = await Promise.all([fetchData(ENTITY_URL.ADVERTISEMENT)]);
      advertisements.value = advertisementResponse.filter(
        (adv: AdvertisementView) => adv.status === 1
      );

      if (userStore.isUserLogon()) {
        const isFavouriteSync = await favStore.isFavoritesInSync();
        const isCheckInIsSync = await checkInStore.isCheckInInSync();

        if (!isFavouriteSync || !isCheckInIsSync) promptUserDataSynAlert();
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
      isDialogOpen.value = false;

      switch (selectedOption) {
        case "local":
          favStore.syncRemoteFromLocal();
          checkInStore.syncRemoteFromLocal();
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

  await fetchAllData();
</script>
