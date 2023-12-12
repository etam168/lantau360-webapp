<template>
  <q-page>
    <app-page-title :title="$t('favourite.title')"></app-page-title>
    <carousel-section :data="advertisements" />
    <app-tab-select :tab-items="tabItems" :current-tab="tab" @update:currentTab="setTab" />

    <app-tab-panels v-model="tab">
      <q-tab-panel name="location" class="q-pa-sm">
        <app-favourite-item-list :favoriteItems="siteItems" />
      </q-tab-panel>

      <q-tab-panel name="business" class="q-pa-sm">
        <app-favourite-item-list :favoriteItems="businessItems" />
      </q-tab-panel>

      <q-tab-panel name="coupon">
        <div>Coupon</div>
      </q-tab-panel>
    </app-tab-panels>
  </q-page>
</template>

<script setup lang="ts">
  // 3rd Party Import
  import axios, { AxiosError } from "axios";

  // .ts file
  import { URL, STORAGE_KEYS } from "@/constants";
  import { Site } from "@/interfaces/models/entities/site";
  import { Business } from "@/interfaces/models/entities/business";
  import { LocalStorage } from "quasar";

  const CarouselSection = defineAsyncComponent(() => import("./section/carousel-section.vue"));

  const siteItems = computed(() => {
    return (LocalStorage.getItem(STORAGE_KEYS.SITEFAVOURITES) ?? []) as Site[];
  });

  const businessItems = computed(() => {
    return (LocalStorage.getItem(STORAGE_KEYS.BUSINESSFAVOURITES) ?? []) as Business[];
  });

  const advertisements = ref<any | null>(null);
  const error = ref<string | null>(null);

  const { t } = useI18n({ useScope: "global" });
  const tab = ref("location");
  const tabItems = ref([
    { name: "location", label: t("favourite.tabItems.location") },
    { name: "business", label: t("favourite.tabItems.business") },
    { name: "coupon", label: t("favourite.tabItems.coupon") }
  ]);

  function setTab(val: string) {
    tab.value = val;
  }

  try {
    const [respAdvertisement] = await Promise.all([axios.get(`${URL.ADVERTISEMENT}`)]);
    advertisements.value = respAdvertisement.data;
  } catch (err) {
    if (err instanceof AxiosError) {
      if (err.response && err.response.status === 404) {
        error.value = "Not found";
      } else {
        error.value = "An error occurred";
      }
    } else {
      error.value = "An unexpected error occurred";
    }
  }
</script>
