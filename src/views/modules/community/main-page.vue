<!-- Main Page Component -->
<template>
  <q-page>
    <app-bar-title :title="$t(`${i18nKey}.advertisement`)" />
    <app-carousel-section :data="advertisements" @image-click="onImageClick" />
    <q-separator size="4px" color="primary" />

    <main-content :events :notices :directory-data="communityDirectories" :entityKey :i18nKey />
  </q-page>
</template>

<script setup lang="ts">
  // Types
  import type { AdvertisementView } from "@/interfaces/models/views/advertisement-view";
  import type { CommunityDirectory } from "@/interfaces/models/entities/community-directory";
  import type { CommunityEventView } from "@/interfaces/models/views/community-event-view";
  import type { CommunityNoticeView } from "@/interfaces/models/views/community-notice-view";
  import type { SiteDirectory } from "@/interfaces/models/entities/site-directory";

  // Constants
  import { ENTITY_URL, EntityURLKey } from "@/constants";

  // Custom Components
  import MainContent from "./components/main-content.vue";

  // Props
  const { entityKey } = defineProps<{
    entityKey: EntityURLKey;
  }>();

  const { t } = useI18n({ useScope: "global" });
  const { fetchData } = useApi();
  const { openCategoryDetailDialog } = useCategoryDialogService(entityKey);
  const { getEntityName } = useUtilities();

  const advertisements = ref<AdvertisementView[]>([]);
  const communityDirectories = ref<CommunityDirectory[]>([]);
  const events = ref<CommunityEventView[]>([]);
  const notices = ref<CommunityNoticeView[]>([]);
  const error = ref<string | null>(null);

  const i18nKey = getEntityName(entityKey);

  const $q = useQuasar();

  const THRESHOLD = 320;
  const isDialogOpen = ref(false);
  const usedHeight = computed(() => {
    const width = Math.min($q.screen.width, 1024);
    const carouselHeight = (width * 9) / 16;
    return carouselHeight + 105;
  });

  const onImageClick = (category: AdvertisementView) => {
    openCategoryDetailDialog(isDialogOpen,category, "ADVERTISEMENT");
  };

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
        (directory: SiteDirectory) => directory.status === 1
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

  /**
   * Fetch data as part of the setup
   * This ensures that the component is compatible with Suspense
   */
  await fetchAllData();
</script>
