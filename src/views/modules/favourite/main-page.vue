<template>
  <q-page>
    <app-bar-title :title="$t(`${i18nKey}.advertisement`)" />
    <app-carousel-section :data="advertisements" @image-click="onImageClick" />

    <q-separator size="4px" color="primary" />

    <q-scroll-area v-if="$q.screen.height - usedHeight > THRESHOLD" :style="scrollAreaStyle">
      <main-content
        v-model:tab="tab"
        :i18n-key="i18nKey"
        :tab-items="tabItems"
        :site-items="siteItems"
        :business-items="businessItems"
        :check-ins="checkIns"
        @update:current-tab="setTab"
        @on-category-detail="onCategoryDetail"
      />
    </q-scroll-area>

    <main-content
      v-else
      v-model:tab="tab"
      :i18n-key="i18nKey"
      :tab-items="tabItems"
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
  import type { FavouriteSite } from "@/interfaces/models/entities/favourite-site";

  import type { SiteView } from "@/interfaces/models/views/site-view";
  import type { TabItem } from "@/interfaces/tab-item";

  // Custom Components
  const mainContent = defineAsyncComponent(() => import("./components/main-content.vue"));

  // Constants
  import { STORAGE_KEYS, EntityURLKey, ENTITY_URL } from "@/constants";

  // Composables
  import { LocalStorage } from "quasar";
  import { useUserStore } from "@/stores/user";
  import { FavouriteBusiness } from "@/interfaces/models/entities/favourite-business";

  // Props
  const { entityKey } = defineProps<{
    entityKey: EntityURLKey;
  }>();

  const userStore = useUserStore();
  const $q = useQuasar();
  const { api } = useApi();
  const { t } = useI18n({ useScope: "global" });
  const { fetchData } = useApi();
  const { openCategoryDetailDialog } = useCategoryDialogService(entityKey);
  const { eventBus, isSmallScreen, getEntityName } = useUtilities();

  const THRESHOLD = 320;
  const advertisements = ref<any | null>(null);

  const siteItems = ref<SiteView[]>(LocalStorage.getItem(STORAGE_KEYS.SAVED.SITE) ?? []);
  const businessItems = ref<BusinessView[]>(
    LocalStorage.getItem(STORAGE_KEYS.SAVED.BUSINESS) ?? []
  );

  const favSiteServer = ref([]);
  const favBusinessServer = ref([]);

  const dialogStack = ref<string[]>([]);
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

  const tabItems = ref<TabItem[]>([
    { name: "location", label: t(`${i18nKey}.tabItem.location`) },
    { name: "business", label: t(`${i18nKey}.tabItem.business`) }
  ]);

  const checkIns: Ref<CheckIn[]> = ref([]);

  async function fetchAllData() {
    try {
      const [advertisementResponse] = await Promise.all([fetchData(ENTITY_URL.ADVERTISEMENT)]);
      advertisements.value = advertisementResponse;

      advertisements.value = advertisementResponse.filter(
        (adv: AdvertisementView) => adv.status === 1
      );

      if (userStore.isUserLogon()) {
        await syncFavoriteData();
      } else {
        //directly use the local storage data that has already been setup in siteItems and businessItem
        //Can remove this else block if no extra logic required
      }
    } catch (err) {
      handleError(err);
    }
  }

  async function syncFavoriteData() {
    try {
      const [siteResponse, businessResponse] = await Promise.all([
        fetchData(`${ENTITY_URL.FAVOURITE_SITE}/ByMemberId/${userStore.userId}`),
        fetchData(`${ENTITY_URL.FAVOURITE_BUSINESS}/ByMemberId/${userStore.userId}`)
      ]);

      favSiteServer.value = siteResponse;
      favBusinessServer.value = businessResponse;

      if (isDataOutOfSync(siteResponse, businessResponse)) {
        promptUserDataSynAlert();
      }
    } catch (fetchError) {
      console.error("Failed to fetch updated site or business data:", fetchError);
    }
  }

  function isDataOutOfSync(
    siteResponse: FavouriteSite[],
    businessResponse: FavouriteBusiness[]
  ): boolean {
    const apiSiteIds = siteResponse.map(item => item.siteId).sort();
    const localSiteIds = siteItems.value.map(item => item.siteId).sort();

    const apiBusinessIds = businessResponse.map(item => item.businessId).sort();
    const localBusinessIds = businessItems.value.map(item => item.businessId).sort();

    const areSitesInSync =
      apiSiteIds.length === localSiteIds.length &&
      apiSiteIds.every((id, index) => id === localSiteIds[index]);

    const areBusinessesInSync =
      apiBusinessIds.length === localBusinessIds.length &&
      apiBusinessIds.every((id, index) => id === localBusinessIds[index]);

    return !areSitesInSync || !areBusinessesInSync;
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
      component: defineAsyncComponent(
        () => import("@/views/modules/favourite/components/data-sync-alert-dialog.vue")
      )
    }).onOk(async (selectedOption: string) => {
      // Reset dialog state when it is dismissed/closed
      isDialogOpen.value = false;
      debugger;

      if (selectedOption === "local") {
        syncLocalData();
      } else {
        syncServerData();
      }
    });
  }

  //send data from local storage to api to sync
  async function syncLocalData() {
    try {
      // Extract records from local storage that are not in the API response
      const missingSites = siteItems.value.filter(
        localSite =>
          !favSiteServer.value.some(
            apiSite => (apiSite as FavouriteSite).siteId === localSite.siteId
          )
      );

      const missingBusinesses = businessItems.value.filter(
        localBusiness =>
          !favBusinessServer.value.some(
            apiBusiness =>
              (apiBusiness as FavouriteBusiness).businessId === localBusiness.businessId
          )
      );

      // Sync missing sites with the API
      for (const site of missingSites) {
        const payload = {
          siteId: site.siteId,
          createdBy: userStore.userId,
          modifiedBy: userStore.userId,
          siteData: { data: site }
        };

        await api.create(`${ENTITY_URL.FAVOURITE_SITE_UPSERT}/${site.siteId}`, payload);
      }

      // Sync missing businesses with the API
      for (const business of missingBusinesses) {
        const payload = {
          businessId: business.businessId,
          businessData: { data: business },
          createdBy: userStore.userId,
          modifiedBy: userStore.userId
        };

        await api.create(`${ENTITY_URL.FAVOURITE_BUSINESS_UPSERT}/${business.businessId}`, payload);
      }

      $q.notify({
        type: "positive",
        message: "Local records have been successfully synced to the server."
      });
    } catch (error) {
      console.error("Failed to sync local data with the backend:", error);
      $q.notify({
        type: "negative",
        message: "An error occurred while syncing data. Please try again."
      });
    }
  }

  //sync local storage data from api
  async function syncServerData() {
    
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

  onMounted(() => {
    eventBus("favoriteUpdated").on(item => {
      if ("siteId" in item) {
        siteItems.value = (LocalStorage.getItem(STORAGE_KEYS.SAVED.SITE) ?? []) as SiteView[];
      } else if ("businessId" in item) {
        businessItems.value = (LocalStorage.getItem(STORAGE_KEYS.SAVED.BUSINESS) ??
          []) as BusinessView[];
      }
    });

    eventBus("DialogStatus").on((status: any, emitter: string) => {
      if (status) {
        dialogStack.value.push(emitter);
      } else {
        dialogStack.value.pop();
      }
    });
  });

  onBeforeRouteLeave((_to, _from, next) => {
    if (dialogStack.value.length > 0) {
      const emitter = dialogStack.value[dialogStack.value.length - 1];
      eventBus(emitter).emit();
      dialogStack.value.pop();
      next(false);
    } else {
      next();
    }
  });

  /**
   * Fetch data as part of the setup
   * This ensures that the component is compatible with Suspense
   */
  await fetchAllData();
</script>
