<template>
  <q-page>
    <app-bar-title :title="$t(`${i18nKey}.advertisement`)" />
    <app-carousel-section :data="advertisements" @image-click="onImageClick" />
    <q-separator size="4px" color="primary" />

    <q-scroll-area v-if="$q.screen.height - usedHeight > THRESHOLD" :style="scrollAreaStyle">
      <main-content
        v-model:tab="tab"
        :i18n-key="i18nKey"
        :tab-items="tabItems"
        :events="events"
        :notices="notices"
        :directory-data="communityDirectories"
        @update:current-tab="setTab"
        @on-directory-item="onDirectoryItem"
      />
    </q-scroll-area>

    <main-content
      v-else
      v-model:tab="tab"
      :tab-items="tabItems"
      :i18n-key="i18nKey"
      :events="events"
      :notices="notices"
      :directory-data="communityDirectories"
      @update:current-tab="setTab"
      @on-directory-item="onDirectoryItem"
    />
  </q-page>
</template>

<script setup lang="ts">
  // Interface files
  import type { AdvertisementView } from "@/interfaces/models/views/advertisement-view";
  import type { CommunityDirectory } from "@/interfaces/models/entities/community-directory";
  import type { CommunityEventView } from "@/interfaces/models/views/community-event-view";
  import type { CommunityNoticeView } from "@/interfaces/models/views/community-notice-view";
  import type { Directory } from "@/interfaces/models/entities/directory";
  import type { TabItem } from "@/interfaces/tab-item";

  // Custom Components
  const mainContent = defineAsyncComponent(() => import("./components/main-content.vue"));

  // Constants
  import { ENTITY_URL, EntityURLKey } from "@/constants";

  // Props
  const { entityKey } = defineProps<{
    entityKey: EntityURLKey;
  }>();

  const $q = useQuasar();
  const { t } = useI18n({ useScope: "global" });
  const { eventBus, isSmallScreen } = useUtilities();
  const { fetchData } = useApi();

  const { openCategoryDetailDialog } = useCategoryDialogService(
    `${entityKey}_DIRECTORY` as EntityURLKey
  );

  const { openCommunityItemDialog } = useCommunityDialogService(
    `${entityKey}_DIRECTORY` as EntityURLKey
  );

  const THRESHOLD = 320;
  const advertisements = ref<AdvertisementView[]>([]);
  const communityDirectories = ref<CommunityDirectory[]>([]);
  const events = ref<CommunityEventView[]>([]);
  const notices = ref<CommunityNoticeView[]>([]);

  const dialogStack = ref<string[]>([]);
  const error = ref<string | null>(null);

  const setTab = (val: string) => (tab.value = val);
  const tab = ref("events");
  const i18nKey = "community";

  const isDialogOpen = ref(false);

  const usedHeight = computed(() => {
    const width = Math.min($q.screen.width, 1024);
    const carouselHeight = (width * 9) / 16; // Height for the carousel
    return carouselHeight + 84;
  });

  const scrollAreaStyle = computed(() => {
    return { height: `calc(100vh - ${usedHeight.value}px)` };
  });

  const tabItems = ref<TabItem[]>([
    { name: "events", label: t(`${i18nKey}.tabItem.events`) },
    { name: "notice", label: t(`${i18nKey}.tabItem.notice`) },
    { name: "directory", label: t(`${i18nKey}.tabItem.directory`) }
  ]);

  async function fetchAllData() {
    try {
      const [advertisementResponse, directoryResponse, eventResponse, noticeResponse] =
        await Promise.all([
          fetchData(ENTITY_URL.ADVERTISEMENT),
          fetchData(ENTITY_URL.COMMUNITY_DIRECTORY),
          fetchData(ENTITY_URL.COMMUNITY_EVENT_CURRENT),
          fetchData(ENTITY_URL.COMMUNITY_NOTICE_CURRENT)
        ]);

      advertisements.value = advertisementResponse.filter(
        (adv: AdvertisementView) => adv.status === 1
      );
      communityDirectories.value = directoryResponse.filter(
        (directory: Directory) => directory.status === 1
      );
      events.value = eventResponse.filter((comEve: CommunityEventView) => comEve.status === 1);
      notices.value = noticeResponse.filter(
        (comNotice: CommunityNoticeView) => comNotice.status === 1
      );
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

  const onImageClick = (category: AdvertisementView) => {
    const dialogName = "AdvertisementDetail";
    eventBus("DialogStatus").emit(true, dialogName);
    openCategoryDetailDialog(category, dialogName, "ADVERTISEMENT");
  };

  async function onDirectoryItem(communityDirectory: CommunityDirectory) {
    if (isDialogOpen.value) return;
    const dialogName = "PostingListDialog";
    eventBus("DialogStatus").emit(true, dialogName);
    openCommunityItemDialog(isDialogOpen, "POSTING", communityDirectory, dialogName);
  }

  onMounted(() => {
    eventBus("DialogStatus").on((status: any, emitter: string) => {
      if (status) {
        dialogStack.value.push(emitter);
      } else {
        dialogStack.value.pop();
      }
    });
  });

  onBeforeRouteLeave((_to, _from, next) => {
    if (dialogStack.value.length > 0) {
      const emitter = dialogStack.value[dialogStack.value.length - 1];
      eventBus(emitter).emit();
      dialogStack.value.pop();
      next(false);
    } else {
      next();
    }
  });

  /**
   * Fetch data as part of the setup
   * This ensures that the component is compatible with Suspense
   */
  await fetchAllData();
</script>
