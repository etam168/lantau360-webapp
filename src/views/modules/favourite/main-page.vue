<template>
  <q-page>
    <app-carousel-section :data="advertisements" />

    <q-toolbar class="q-mt-sm" v-if="$q.screen.lt.sm">
      <div class="q-gutter-xs row items-center">
        <q-toolbar-title class="text-center text-h6">{{ $t("favourite.title") }}</q-toolbar-title>
        <app-tab-select
          class="q-ml-sm justify-center"
          :tab-items="tabItems"
          :current-tab="tab"
          @update:currentTab="setTab"
        />
      </div>
    </q-toolbar>

    <q-toolbar class="q-mt-sm" v-else>
      <q-toolbar-title>{{ $t("favourite.title") }}</q-toolbar-title>
      <div>
        <app-tab-select :tab-items="tabItems" :current-tab="tab" @update:currentTab="setTab" />
      </div>
    </q-toolbar>

    <app-tab-panels v-model="tab">
      <q-tab-panel name="location" class="q-pa-sm">
        <app-grouped-item-list :list-items="siteItems" />
      </q-tab-panel>

      <q-tab-panel name="business" class="q-pa-sm">
        <app-grouped-item-list :list-items="businessItems" />
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

  const siteItems = computed(() => {
    return (LocalStorage.getItem(STORAGE_KEYS.SITEFAVOURITES) ?? []) as Site[];
  });

  const businessItems = computed(() => {
    return (LocalStorage.getItem(STORAGE_KEYS.BUSINESSFAVOURITES) ?? []) as Business[];
  });

  const advertisements = ref<any | null>(null);
  const error = ref<string | null>(null);

  const { t } = useI18n({ useScope: "global" });

  const setTab = (val: string) => (tab.value = val);
  const tab = ref("location");
  const tabItems = ref([
    { name: "location", label: t("favourite.tabItems.location") },
    { name: "business", label: t("favourite.tabItems.business") },
    { name: "coupon", label: t("favourite.tabItems.coupon") }
  ]);

  try {
    const [advertisementResponse] = await Promise.all([axios.get(`${URL.ADVERTISEMENT}`)]);
    advertisements.value = advertisementResponse.data;
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
