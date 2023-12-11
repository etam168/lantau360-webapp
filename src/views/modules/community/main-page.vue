<template>
  <app-page-title :title="$t('community.title')"></app-page-title>
  <carousel-section :data="promotions" />
  <app-tab-select :tab-items="tabItems" :current-tab="tab" @update:currentTab="setTab" />

  <app-tab-panels v-model="tab">
    <q-tab-panel name="news">
      <news-section :data="newsData" />
    </q-tab-panel>

    <q-tab-panel name="events" class="q-pa-sm">
      <events-section :events="eventData" />
    </q-tab-panel>

    <q-tab-panel name="notice">
      <notice-section :data="notifications" />
    </q-tab-panel>

    <q-tab-panel name="directory">
      <q-toolbar class="q-pb-md row justify-center">
        <custom-search-bar @on-search="handleSearchDialog" />
      </q-toolbar>
      <directories-section :data="directoriesData" class="q-mb-md" />
    </q-tab-panel>
  </app-tab-panels>
</template>

<script setup lang="ts">
  // Vue Import
  import { defineAsyncComponent, onMounted, ref } from "vue";
  import { onBeforeRouteLeave } from "vue-router";

  // 3rd Party Import
  import axios, { AxiosError } from "axios";
  import { useI18n } from "vue-i18n";
  import { useQuasar } from "quasar";

  // .ts file
  import { URL } from "@/constants";
  import { Directory } from "@/interfaces/models/entities/directory";
  import { CommunityEvent } from "@/interfaces/models/entities/communityEvent";
  import { CommunityNews } from "@/interfaces/models/entities/communityNews";
  import { TabItem } from "@/interfaces/tab-item";
  import eventBus from "@/utils/event-bus";

  // Custom Components
  import CustomSearchBar from "@/components/custom/custom-search-bar.vue";
  import DirectoriesSection from "./section/directories-section.vue";
  import EventsSection from "./section/events-section.vue";
  import NewsSection from "./section/news-section.vue";
  import NoticeSection from "./section/notice-section.vue";
  import CarouselSection from "./section/carousel-section.vue";

  const { t } = useI18n({ useScope: "global" });
  const $q = useQuasar();

  const promotions = ref<any | null>(null);
  const directoriesData = ref();
  const eventData = ref();
  const newsData = ref();
  const notifications = ref();
  const dialogStack = ref<string[]>([]);

  const error = ref<string | null>(null);

  const setTab = (val: string) => (tab.value = val);
  const tab = ref("news");
  const tabItems = ref<TabItem[]>([
    { name: "news", label: t("community.tabItems.news") },
    { name: "events", label: t("community.tabItems.events") },
    { name: "notice", label: t("community.tabItems.notice") },
    { name: "directory", label: t("community.tabItems.directory") }
  ]);

  function handleSearchDialog(value: any) {
    debugger;
    $q.dialog({
      component: defineAsyncComponent(() => import("./search-community/index.vue")),
      componentProps: {
        query: { searchKeyword: value }
      }
    });
  }

  onMounted(() => {
    eventBus.on("DialogStatus", (status, emitter) => {
      if (status) {
        dialogStack.value.push(emitter);
      } else {
        dialogStack.value = dialogStack.value.filter(item => item != emitter);
      }
    });
  });

  onBeforeRouteLeave((_to, _from, next) => {
    if (dialogStack.value.length > 0) {
      const emitter = dialogStack.value[dialogStack.value.length - 1];
      eventBus.emit(emitter);
      dialogStack.value = dialogStack.value.filter(item => item != emitter);

      next(false);
    } else {
      next();
    }
  });

  try {
    const [respPromotions, respEvent, respDirectories, respNews, respNotice] = await Promise.all([
      axios.get(`${URL.ADVERTISEMENT}`),
      axios.get<CommunityEvent>(`${URL.COMMUNITY_EVENT}`),
      axios.get<Directory>(`${URL.COMMUNITY_DIRECTORY}`),
      axios.get<CommunityNews>(`${URL.COMMUNITY_NEWS}`),
      axios.get<CommunityNews>(`${URL.COMMUNITY_NOTICE}`)
    ]);

    promotions.value = respPromotions.data;
    eventData.value = respEvent.data;
    directoriesData.value = respDirectories.data;
    newsData.value = respNews.data;
    notifications.value = respNotice.data;
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
