<template>
  <q-page>
    <q-bar dense class="bg-primary text-white">
      <div class="col text-center">{{ $t("community.advertisement") }}</div>
    </q-bar>

    <app-carousel-section :data="advertisements" />
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
        <app-directory-section :rightSlotAction="1" :data="directories" class="q-my-sm" />
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

  const { eventBus, isSmallScreen } = useUtilities();
  const { t } = useI18n({ useScope: "global" });

  const { fetchMemberPoints } = useUserStore();

  const advertisements = ref<AdvertisementView[]>([]);
  const directories = ref<CommunityDirectory[]>([]);
  const events = ref<CommunityEventView[]>([]);
  const news = ref<CommunityNews[]>([]);
  const notices = ref<CommunityNotice[]>([]);
  const dialogStack = ref<string[]>([]);
  const error = ref<string | null>(null);
  const $q = useQuasar();

  const titleClass = computed(() => (isSmallScreen.value ? "text-center" : ""));
  const tabSelectClass = computed(() => (isSmallScreen.value ? "q-mt-xs flex justify-center" : ""));

  const setTab = (val: string) => (tab.value = val);
  const tab = ref("events");
  const tabItems = ref<TabItem[]>([
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

    eventBus.on("createPost", () => {
      $q.dialog({
        component: defineAsyncComponent(() => import("./input-dialog/index.vue"))
      });
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
        axios.get(URL.COMMUNITY_EVENT_CURRENT),
        axios.get(URL.COMMUNITY_DIRECTORY),
        axios.get(URL.COMMUNITY_NEWS_CURRENT),
        axios.get(URL.COMMUNITY_NOTICE_CURRENT)
      ]);

    advertisements.value = advertisementResponse.data;
    events.value = eventResponse.data;
    news.value = newsResponse.data;
    notices.value = noticeResponse.data;

    directories.value = useSorted(directoryResponse.data, (a, b) => a.rank - b.rank).value.filter(
      (directory: Directory) => directory.status === 1
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
