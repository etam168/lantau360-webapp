<template>
  <q-card-actions align="center">
    <div class="text-h6 text-weight-medium">{{ $t("community.title") }}</div>
  </q-card-actions>

  <promotion-section :data="promotions" />

  <q-toolbar class="text-white bg-grey-3">
    <q-chip
      v-for="(tabItem, index) in tabItems"
      :key="index"
      :outline="tab !== tabItem.name"
      color="primary"
      text-color="white"
      clickable
      @click="setTab(tabItem.name)"
    >
      {{ tabItem.label }}
    </q-chip>
  </q-toolbar>

  <q-tab-panels
    v-model="tab"
    animated
    transition-prev="fade"
    transition-next="fade"
    transition-duration="1000"
  >
    <q-tab-panel name="news">
      <div>News</div>
    </q-tab-panel>

    <q-tab-panel name="events">
      <div>Events</div>
    </q-tab-panel>

    <q-tab-panel name="notice">
      <div>Notice</div>
    </q-tab-panel>

    <q-tab-panel name="directory">
      <directories-section :data="directoriesData" class="q-mb-md" />
    </q-tab-panel>
  </q-tab-panels>
</template>

<script setup lang="ts">
  // Vue Import
  import { ref } from "vue";

  // 3rd Party Import
  import axios, { AxiosError } from "axios";
  import { useI18n } from "vue-i18n";

  // .ts file
  import { COMMUNITY_DIRECTORY, PROMOTION_URL } from "@/constants";

  import DirectoriesSection from "./section/directories-section.vue";
  import PromotionSection from "./section/promotion-section.vue";
  import { Directory } from "@/interfaces/models/entities/directory";

  const { t } = useI18n({ useScope: "global" });
  const promotions = ref<any | null>(null);
  const directoriesData = ref();
  const latestOffers = ref();
  const tab = ref("news");

  const error = ref<string | null>(null);

  const tabItems = ref([
    { name: "news", label: t("community.tabItems.news") },
    { name: "events", label: t("community.tabItems.events") },
    { name: "notice", label: t("community.tabItems.notice") },
    { name: "directory", label: t("community.tabItems.directory") }
  ]);

  function setTab(val: string) {
    tab.value = val;
  }

  try {
    const [respPromotions, respLatestOffers, respDirectories] = await Promise.all([
      axios.get(`${PROMOTION_URL}/108`),
      axios.get(`${PROMOTION_URL}/100`),
      axios.get<Directory>(`${COMMUNITY_DIRECTORY}`)
    ]);
    promotions.value = respPromotions.data.data;
    latestOffers.value = respLatestOffers.data.data;
    directoriesData.value = respDirectories.data;
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
