<template>
  <q-page>
    <!-- <app-page-title :title="$t('community.title')"></app-page-title> -->
    <app-carousel-section :data="advertisements" />

    <q-toolbar class="q-mt-sm" v-if="$q.screen.lt.sm">
      <div class="q-gutter-xs row items-center">
        <q-toolbar-title class="text-center text-h6">{{ $t("community.title") }}</q-toolbar-title>
        <app-tab-select
          class="q-ml-sm justify-center"
          :tab-items="tabItems"
          :current-tab="tab"
          @update:currentTab="setTab"
        />
      </div>
    </q-toolbar>

    <q-toolbar class="q-mt-sm" v-else>
      <q-toolbar-title>{{ $t("community.title") }}</q-toolbar-title>
      <div>
        <app-tab-select :tab-items="tabItems" :current-tab="tab" @update:currentTab="setTab" />
      </div>
    </q-toolbar>

    <!-- <app-tab-select :tab-items="tabItems" :current-tab="tab" @update:currentTab="setTab" /> -->

    <app-tab-panels v-model="tab">
      <q-tab-panel name="news">
        <app-bulletin-item-list :items="news" />
      </q-tab-panel>

      <q-tab-panel name="events" class="q-pa-sm">
        <app-bulletin-item-list :items="events" />
      </q-tab-panel>

      <q-tab-panel name="notice">
        <app-bulletin-item-list :items="notices" />
      </q-tab-panel>

      <q-tab-panel name="directory">
        <app-directory-section :data="directories" class="q-my-sm" />
      </q-tab-panel>
    </app-tab-panels>
  </q-page>
</template>

<script setup lang="ts">
  // 3rd Party Import
  import axios, { AxiosError } from "axios";

  // .ts file
  import { URL } from "@/constants";
  import { Advertisement } from "@/interfaces/models/entities/advertisement";
  import { CommunityDirectory } from "@/interfaces/models/entities/community-directory";
  import { CommunityEvent } from "@/interfaces/models/entities/community-event";
  import { CommunityNews } from "@/interfaces/models/entities/community-news";
  import { CommunityNotice } from "@/interfaces/models/entities/community-notice";
  import { TabItem } from "@/interfaces/tab-item";
  import eventBus from "@/utils/event-bus";

  const { t } = useI18n({ useScope: "global" });

  const advertisements = ref<Advertisement[]>([]);
  const directories = ref<CommunityDirectory[]>([]);
  const events = ref<CommunityEvent[]>([]);
  const news = ref<CommunityNews[]>([]);
  const notices = ref<CommunityNotice[]>([]);
  const dialogStack = ref<string[]>([]);
  const error = ref<string | null>(null);

  const setTab = (val: string) => (tab.value = val);
  const tab = ref("events");
  const tabItems = ref<TabItem[]>([
    // { name: "news", label: t("community.tabItems.news") },
    { name: "events", label: t("community.tabItems.events") },
    { name: "notice", label: t("community.tabItems.notice") },
    { name: "directory", label: t("community.tabItems.directory") }
  ]);

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
        axios.get(URL.ADVERTISEMENT),
        axios.get(URL.COMMUNITY_EVENT),
        axios.get(URL.COMMUNITY_DIRECTORY),
        axios.get(URL.COMMUNITY_NEWS),
        axios.get(URL.COMMUNITY_NOTICE)
      ]);

    advertisements.value = advertisementResponse.data;
    directories.value = directoryResponse.data;
    events.value = eventResponse.data;
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
