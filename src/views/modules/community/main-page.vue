<template>
  <q-page>
    <q-bar dense class="bg-primary text-white">
      <div class="col text-center text-uppercase">{{ $t("community.advertisement") }}</div>
    </q-bar>

    <app-carousel-section :data="advertisements" :aspect-ratio="aspectRatio()" />
    <q-separator size="4px" color="primary" />

    <q-banner :inline-actions="!isSmallScreen">
      <q-toolbar-title :class="titleClass">{{ $t("community.title") }}</q-toolbar-title>

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
        <app-directory-item-list :rightSlotAction="1" :data="directories" class="q-my-sm" />
      </q-tab-panel>
    </q-tab-panels>
  </q-page>
</template>

<script setup lang="ts">
  // Interface files
  import { AdvertisementView } from "@/interfaces/models/views/advertisement-view";
  import { CommunityDirectory } from "@/interfaces/models/entities/community-directory";
  import { CommunityEventView } from "@/interfaces/models/views/community-event-view";
  import { CommunityNews } from "@/interfaces/models/entities/community-news";
  import { CommunityNotice } from "@/interfaces/models/entities/community-notice";
  import { Directory } from "@/interfaces/models/entities/directory";
  import { TabItem } from "@/interfaces/tab-item";

  // .ts file
  import { URL } from "@/constants";
  import { useUserStore } from "@/stores/user";
  import { Content } from "@/interfaces/models/entities/content";

  const { eventBus, isSmallScreen, aspectRatio } = useUtilities();

  const { t } = useI18n({ useScope: "global" });

  const { fetchMemberPoints, setPoints } = useUserStore();

  const advertisements = ref<AdvertisementView[]>([]);
  const directories = ref<CommunityDirectory[]>([]);
  const events = ref<CommunityEventView[]>([]);
  const news = ref<CommunityNews[]>([]);
  const notices = ref<CommunityNotice[]>([]);
  const memberConfig = ref<Content>();

  const dialogStack = ref<string[]>([]);
  const error = ref<string | null>(null);

  const titleClass = computed(() => (isSmallScreen.value ? "text-center" : ""));
  const tabSelectClass = computed(() => (isSmallScreen.value ? "q-mt-xs flex justify-center" : ""));

  const setTab = (val: string) => (tab.value = val);
  const tab = ref("events");
  const tabItems = ref<TabItem[]>([
    { name: "events", label: t("community.tabItems.events") },
    { name: "notice", label: t("community.tabItems.notice") },
    { name: "directory", label: t("community.tabItems.directory") }
  ]);

  provide("memberConfig", memberConfig);

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
    const [
      advertisementResponse,
      eventResponse,
      directoryResponse,
      newsResponse,
      noticeResponse,
      memberConfigResponse
    ] = await Promise.all([
      axios.get(URL.ADVERTISEMENT),
      axios.get(URL.COMMUNITY_EVENT_CURRENT),
      axios.get(URL.COMMUNITY_DIRECTORY),
      axios.get(URL.COMMUNITY_NEWS_CURRENT),
      axios.get(URL.COMMUNITY_NOTICE_CURRENT),
      axios.get(URL.MEMBER_CONFIG)
    ]);

    advertisements.value = advertisementResponse.data.filter(
      (adv: AdvertisementView) => adv.status === 1
    );
    directories.value = directoryResponse.data.filter(
      (directory: Directory) => directory.status === 1
    );
    events.value = eventResponse.data.filter((comEve: CommunityEventView) => comEve.status === 1);
    news.value = newsResponse.data.filter((comNews: CommunityNews) => comNews.status === 1);
    notices.value = noticeResponse.data.filter(
      (comNotice: CommunityNotice) => comNotice.status === 1
    );
    memberConfig.value = memberConfigResponse.data;

    setPoints(
      memberConfig.value?.meta.postPoint ?? 50,
      memberConfig.value?.meta.requestFreePoints ?? 100
    );

    // Sync user points.
    await fetchMemberPoints();
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
