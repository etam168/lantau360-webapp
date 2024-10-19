<template>
  <q-page>
    <q-bar dense class="bg-primary text-white">
      <div class="col text-center text-uppercase">{{ $t(`${i18nKey}.advertisement`) }}</div>
    </q-bar>

    <app-carousel-section :data="advertisements" />
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
      <!-- <q-tab-panel name="news">
        <app-bulletin-item-list :items="news" />
      </q-tab-panel> -->

      <q-tab-panel name="events" class="q-pa-sm">
        <app-bulletin-item-list :items="events" />
      </q-tab-panel>

      <q-tab-panel name="notice">
        <app-bulletin-item-list :items="notices" />
      </q-tab-panel>

      <q-tab-panel name="directory">
        <app-directory-items :data="directoryData" @on-directory-item="onDirectoryItem" />
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
  import { ENTITY_URL, EntityURLKey } from "@/constants";
  import { useUserStore } from "@/stores/user";
  import { Content } from "@/interfaces/models/entities/content";

  const { eventBus, isSmallScreen } = useUtilities();

  const { t } = useI18n({ useScope: "global" });
  const { fetchData } = useApi();
  const entityKey: EntityURLKey = "COMMUNITY_DIRECTORY";

  const { fetchMemberPoints, setPoints } = useUserStore();
  const { openCommunityItemDialog } = useCategoryDialogService(entityKey);

  const advertisements = ref<AdvertisementView[]>([]);
  const directoryData = ref<CommunityDirectory[]>([]);
  const events = ref<CommunityEventView[]>([]);
  const news = ref<CommunityNews[]>([]);
  const notices = ref<CommunityNotice[]>([]);
  const memberConfig = ref<Content>();

  const dialogStack = ref<string[]>([]);
  const error = ref<string | null>(null);
  const isDialogOpen = ref(false);

  const titleClass = computed(() => (isSmallScreen.value ? "text-center" : ""));
  const tabSelectClass = computed(() => (isSmallScreen.value ? "q-mt-xs flex justify-center" : ""));

  const setTab = (val: string) => (tab.value = val);
  const tab = ref("events");
  const i18nKey = "community";

  const tabItems = ref<TabItem[]>([
    { name: "events", label: t(`${i18nKey}.tabItem.events`) },
    { name: "notice", label: t(`${i18nKey}.tabItem.notice`) },
    { name: "directory", label: t(`${i18nKey}.tabItem.directory`) }
  ]);

  provide("memberConfig", memberConfig);

  async function onDirectoryItem(communityDirectory: CommunityDirectory) {
    if (isDialogOpen.value) return;
    openCommunityItemDialog(isDialogOpen, "POSTING" ,communityDirectory);
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

  async function fetchAllData() {
    try {
      const [
        advertisementResponse,
        directoryResponse,
        eventResponse,
        newsResponse,
        noticeResponse,
        memberConfigResponse
      ] = await Promise.all([
        fetchData(ENTITY_URL.ADVERTISEMENT),
        fetchData(ENTITY_URL.COMMUNITY_DIRECTORY),
        fetchData(ENTITY_URL.COMMUNITY_EVENT_CURRENT),
        fetchData(ENTITY_URL.COMMUNITY_NEWS_CURRENT),
        fetchData(ENTITY_URL.COMMUNITY_NOTICE_CURRENT),
        fetchData(ENTITY_URL.MEMBER_CONFIG)
      ]);

      advertisements.value = advertisementResponse.filter(
        (adv: AdvertisementView) => adv.status === 1
      );
      directoryData.value = directoryResponse.filter(
        (directory: Directory) => directory.status === 1
      );
      events.value = eventResponse.filter((comEve: CommunityEventView) => comEve.status === 1);
      news.value = newsResponse.filter((comNews: CommunityNews) => comNews.status === 1);
      notices.value = noticeResponse.filter((comNotice: CommunityNotice) => comNotice.status === 1);
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
  }

  await fetchAllData();
</script>
