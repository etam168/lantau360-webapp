<template>
  <q-page>
    <app-page-title :title="$t('community.title')"></app-page-title>
    <app-carousel-section :data="advertisements" />
    <app-tab-select :tab-items="tabItems" :current-tab="tab" @update:currentTab="setTab" />

    <app-tab-panels v-model="tab">
      <q-tab-panel name="news">
        <news-section :data="news" />
      </q-tab-panel>

      <q-tab-panel name="events" class="q-pa-sm">
        <!-- <events-section :events="events" /> -->
        <app-card-item-list :items="events" />
      </q-tab-panel>

      <q-tab-panel name="notice">
        <notice-section :data="notices" />
      </q-tab-panel>

      <q-tab-panel name="directory">
        <q-card-actions align="center">
          <app-search-bar @on-search="handleSearchDialog" />
        </q-card-actions>

        <directory-section :data="directories" class="q-my-sm" />
      </q-tab-panel>
    </app-tab-panels>
  </q-page>
</template>

<script setup lang="ts">
  // 3rd Party Import
  import axios, { AxiosError } from "axios";
  import { useI18n } from "vue-i18n";
  import { useQuasar } from "quasar";

  // .ts file
  import { URL } from "@/constants";
  import { CommunityDirectory } from "@/interfaces/models/entities/community-directory";
  import { CommunityEvent } from "@/interfaces/models/entities/community-event";
  import { CommunityNews } from "@/interfaces/models/entities/community-news";
  import { TabItem } from "@/interfaces/tab-item";
  import eventBus from "@/utils/event-bus";

  // Custom Components
  import DirectorySection from "./section/directory-section.vue";
  // import EventsSection from "./section/events-section.vue";
  import NewsSection from "./section/news-section.vue";
  import NoticeSection from "./section/notice-section.vue";

  const { t } = useI18n({ useScope: "global" });
  const $q = useQuasar();

  const advertisements = ref<any | null>(null);
  const directories = ref();
  const events = ref();
  const news = ref();
  const notices = ref();
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
    const [advertisementResponse, eventResponse, directoryResponse, newsResponse, noticeResponse] =
      await Promise.all([
        axios.get(`${URL.ADVERTISEMENT}`),
        axios.get<CommunityEvent>(`${URL.COMMUNITY_EVENT}`),
        axios.get<CommunityDirectory>(`${URL.COMMUNITY_DIRECTORY}`),
        axios.get<CommunityNews>(`${URL.COMMUNITY_NEWS}`),
        axios.get<CommunityNews>(`${URL.COMMUNITY_NOTICE}`)
      ]);

    advertisements.value = advertisementResponse.data;
    events.value = eventResponse.data;
    directories.value = directoryResponse.data;
    news.value = newsResponse.data;
    notices.value = noticeResponse.data;
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
