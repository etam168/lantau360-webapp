<template>
  <q-page>
    <q-bar dense class="bg-primary text-white">
      <div class="col text-center text-uppercase">{{ $t(`${i18nKey}.advertisement`) }}</div>
    </q-bar>

    <app-carousel-section
      :data="advertisements"
      :aspect-ratio="aspectRatio()"
      @image-click="onImageClick"
    />
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
          @on-detail="handleDetail"
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
          @on-detail="handleDetail"
        />
      </q-tab-panel>

      <q-tab-panel name="coupon">
        <div>{{ $t(`${i18nKey}.tabItems.coupon`) }}</div>
      </q-tab-panel>
    </q-tab-panels>
  </q-page>
</template>

<script setup lang="ts">
  import { LocalStorage } from "quasar";

  // Interface files
  import type { BusinessView } from "@/interfaces/models/views/business-view";
  import type { SiteView } from "@/interfaces/models/views/site-view";
  import type { TabItem } from "@/interfaces/tab-item";
  import type { CheckIn } from "@/interfaces/models/entities/checkin";

  // .ts file
  import { URL, STORAGE_KEYS } from "@/constants";
  import { CarouselTypes } from "@/interfaces/types/carousel-types";
  import { AdvertisementView } from "@/interfaces/models/views/advertisement-view";

  const { eventBus, isSmallScreen, aspectRatio } = useUtilities();
  const $q = useQuasar();
  const checkIns: Ref<CheckIn[]> = ref([]);

  const siteItems = ref<SiteView[]>(LocalStorage.getItem(STORAGE_KEYS.SAVED.SITE) ?? []);
  const businessItems = ref<BusinessView[]>(
    LocalStorage.getItem(STORAGE_KEYS.SAVED.BUSINESS) ?? []
  );

  const advertisements = ref<any | null>(null);
  const error = ref<string | null>(null);

  const { t } = useI18n({ useScope: "global" });
  const titleClass = computed(() => (isSmallScreen.value ? "text-center" : ""));
  const tabSelectClass = computed(() => (isSmallScreen.value ? "q-mt-xs flex justify-center" : ""));

  const setTab = (val: string) => (tab.value = val);
  const tab = ref("location");
  const i18nKey = "favourite";

  const tabItems = ref<TabItem[]>([
    { name: "location", label: t(`${i18nKey}.tabItem.location`) },
    { name: "business", label: t(`${i18nKey}.tabItem.business`) }
  ]);

  // Updated onImageClick function to handle both Site and Advertisement
  const onImageClick = (item: CarouselTypes) => {
    if (isAdvertisement(item)) {
      $q.dialog({
        component: defineAsyncComponent(
          () => import("@/components/dialog/marketing-detail-dialog.vue")
        ),
        componentProps: {
          item: item as AdvertisementView
        }
      });
    } else {
      $q.dialog({
        component: defineAsyncComponent(
          () => import("@/components/dialog/category-detail-dialog.vue")
        ),
        componentProps: {
          item: item as SiteView
        }
      });
    }
  };

  onMounted(() => {
    eventBus.on("favoriteUpdated", item => {
      if ("siteId" in item) {
        siteItems.value = (LocalStorage.getItem(STORAGE_KEYS.SAVED.SITE) ?? []) as SiteView[];
      } else if ("businessId" in item) {
        businessItems.value = (LocalStorage.getItem(STORAGE_KEYS.SAVED.BUSINESS) ??
          []) as BusinessView[];
      }
    });
  });

  try {
    const [advertisementResponse] = await Promise.all([axios.get(`${URL.ADVERTISEMENT}`)]);
    advertisements.value = advertisementResponse.data;
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

  async function handleDetail(item: any) {
    $q.dialog({
      component: defineAsyncComponent(
        () => import("@/components/dialog/category-detail-dialog/index.vue")
      ),
      componentProps: {
        category: item,
        entityKey: item.siteId ? "SITE" : "BUSINESS"
      }
    });
  }
</script>
