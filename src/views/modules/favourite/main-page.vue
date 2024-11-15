<template>
  <q-page>
    <app-bar-title :title="$t(`${i18nKey}.advertisement`)" />
    <app-carousel-section :data="advertisements" @image-click="onImageClick" />

    <q-separator size="4px" color="primary" />

    <q-banner :inline-actions="!isSmallScreen">
      <q-toolbar-title :class="titleClass">{{ $t(`${i18nKey}.title`) }}</q-toolbar-title>

      <template v-slot:action>
        <app-tab-select
          :class="tabSelectClass"
          :tab-items="tabItems"
          :current-tab="tab"
          @update:currentTab="setTab"
        />
      </template>
    </q-banner>

    <q-tab-panels v-model="tab">
      <q-tab-panel name="location" class="q-pa-none">
        <div
          v-if="siteItems.length == 0"
          class="text-h6 text-weight-regular q-ma-md text-grey-6 text-weight-bold text-center"
        >
          {{ $t("errors.noSaveSiteRecord") }}
        </div>

        <app-category-list-items
          v-else
          :categoryItems="siteItems"
          :checkIns
          :entityKey="'SITE'"
          @on-category-detail="onCategoryDetail"
        />
      </q-tab-panel>

      <q-tab-panel name="business" class="q-pa-none">
        <div
          v-if="businessItems.length == 0"
          class="text-h6 text-weight-regular q-ma-md text-grey-6 text-weight-bold text-center"
        >
          {{ $t("errors.noSaveBusinessRecord") }}
        </div>
        <app-category-list-items
          v-else
          :categoryItems="businessItems"
          :checkIns
          :entityKey="'BUSINESS'"
          @on-category-detail="onCategoryDetail"
        />
      </q-tab-panel>

      <q-tab-panel name="coupon">
        <div>{{ $t(`${i18nKey}.tabItems.coupon`) }}</div>
      </q-tab-panel>
    </q-tab-panels>
  </q-page>
</template>

<script setup lang="ts">
  // Interface files
  import type { BusinessView } from "@/interfaces/models/views/business-view";
  import type { CarouselTypes } from "@/interfaces/types/carousel-types";
  import type { CheckIn } from "@/interfaces/models/entities/checkin";
  import type { SiteView } from "@/interfaces/models/views/site-view";
  import type { TabItem } from "@/interfaces/tab-item";

  // Constants
  import { STORAGE_KEYS, EntityURLKey, ENTITY_URL } from "@/constants";

  // Composables
  import { LocalStorage } from "quasar";

  // Props
  const { entityKey } = defineProps<{
    entityKey: EntityURLKey;
  }>();

  const { t } = useI18n({ useScope: "global" });
  const { fetchData } = useApi();
  const { openCategoryDetailDialog } = useCategoryDialogService(entityKey);
  const { eventBus, isSmallScreen, getEntityName, isAdvertisement } = useUtilities();

  const titleClass = computed(() => (isSmallScreen.value ? "text-center" : ""));
  const tabSelectClass = computed(() => (isSmallScreen.value ? "q-mt-xs flex justify-center" : ""));

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

  const tabItems = ref<TabItem[]>([
    { name: "location", label: t(`${i18nKey}.tabItem.location`) },
    { name: "business", label: t(`${i18nKey}.tabItem.business`) }
  ]);

  const checkIns: Ref<CheckIn[]> = ref([]);

  async function fetchAllData() {
    try {
      const [advertisementResponse] = await Promise.all([fetchData(ENTITY_URL.ADVERTISEMENT)]);
      advertisements.value = advertisementResponse;
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

  const onImageClick = (item: CarouselTypes) => {
    eventBus("DialogStatus").emit(true, "FavDetail");
    openCategoryDetailDialog(item, "FavDetail", "BUSINESS");
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
