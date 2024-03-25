<template>
  <q-page>
    <q-bar dense class="bg-primary text-white">
      <div class="col text-center">{{ $t("favourite.advertisement") }}</div>
    </q-bar>

    <app-carousel-section :data="advertisements" />
    <q-separator size="4px" color="primary" />

    <q-banner :inline-actions="!isSmallScreen">
      <q-toolbar-title :class="titleClass">{{ $t("favourite.title") }}</q-toolbar-title>

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
        <app-grouped-item-list :list-items="siteItems" />
      </q-tab-panel>

      <q-tab-panel name="business" class="q-pa-none">
        <app-grouped-item-list :list-items="businessItems" />
      </q-tab-panel>

      <q-tab-panel name="coupon">
        <div>{{ $t("favourite.tabItems.coupon") }}</div>
      </q-tab-panel>
    </q-tab-panels>
  </q-page>
</template>

<script setup lang="ts">
  import { LocalStorage } from "quasar";

  // Interface files
  import { BusinessView } from "@/interfaces/models/views/business-view";
  import { SiteView } from "@/interfaces/models/views/site-view";

  // .ts file
  import { URL, STORAGE_KEYS } from "@/constants";

  const { eventBus, isSmallScreen } = useUtilities();

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
  const tabItems = ref([
    { name: "location", label: t("favourite.tabItems.location") },
    { name: "business", label: t("favourite.tabItems.business") }
  ]);

  eventBus.on("favoriteUpdated", item => {
    if ("siteId" in item) {
      siteItems.value = (LocalStorage.getItem(STORAGE_KEYS.SAVED.SITE) ?? []) as SiteView[];
    } else if ("businessId" in item) {
      businessItems.value = (LocalStorage.getItem(STORAGE_KEYS.SAVED.BUSINESS) ??
        []) as BusinessView[];
    }
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
</script>
