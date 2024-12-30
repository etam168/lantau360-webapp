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
  import type { SiteView } from "@/interfaces/models/views/site-view";
  import type { TabItem } from "@/interfaces/tab-item";

  // Custom Components
  const mainContent = defineAsyncComponent(() => import("./components/main-content.vue"));

  // Constants
  import { STORAGE_KEYS, EntityURLKey, ENTITY_URL } from "@/constants";

  // Composables
  import { LocalStorage } from "quasar";
  import { useUserStore } from "@/stores/user";

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

      //if user is logedin then send all data from localstorage to sync on backend
      if (userStore.isUserLogon()) {
        for (const item of siteItems.value) {
          try {
            const payload = {
              createdBy: userStore.userId,
              modifiedBy: userStore.userId,
              siteId: (item as SiteView).siteId,
              siteData: { data: item }
            };

            await api.create(`${ENTITY_URL.FAVOURITE_SITE_UPSERT}/${(item as SiteView).siteId}`, payload);
            console.log(`Favorite site with ID ${item.siteId} saved to the database.`);
          } catch (error) {
            console.error(
              `Failed to save favorite site with ID ${item.siteId} to the database:`,
              error
            );
          }
        }

        // Loop over businessItems and upload each to the backend
        for (const item of businessItems.value) {
          try {
            const payload = {
              businessId: (item as BusinessView).businessId,
              businessData: { data: item },
              createdBy: userStore.userId,
              modifiedBy: userStore.userId
            };

            await api.create(`${ENTITY_URL.FAVOURITE_BUSINESS_UPSERT}/${(item as BusinessView).businessId}`, payload);
            console.log(`Favorite business with ID ${item.businessId} saved to the database.`);
          } catch (error) {
            console.error(
              `Failed to save favorite business with ID ${item.businessId} to the database:`,
              error
            );
          }
        }

        // Fetch updated data for both siteItems and businessItems from the backend and then sync the local storage
        try {
          // Fetch favourite sites and businesses for the logged-in user
          const [siteResponse, businessResponse] = await Promise.all([
            fetchData(`${ENTITY_URL.FAVOURITE_SITE}/ByMemberId/${userStore.userId}`),
            fetchData(`${ENTITY_URL.FAVOURITE_BUSINESS}/ByMemberId/${userStore.userId}`)
          ]);

          // // Update siteItems and businessItems with the fetched data
          // siteItems.value = siteResponse; // Replace with the response from the API
          // businessItems.value = businessResponse; // Replace with the response from the API

          console.log("Favourite site and business data refreshed from the API.");
        } catch (fetchError) {
          console.error("Failed to fetch updated site or business data:", fetchError);
        }
        debugger;

      } else {
      }
    } catch (err) {
      if (err instanceof AxiosError) {
        if (err.response && err.response.status === 404) {
          error.value = t("errors.404");
        } else {
          error.value = t("errors.anErrorOccured");
        }
      } else {
        error.value = t("errors.anErrorOccured");
      }
    }
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
