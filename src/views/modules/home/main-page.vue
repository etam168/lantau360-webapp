<template>
  <q-page>
    <app-carousel-section :data="attractions" @image-click="onImageClick" />

    <q-scroll-area v-if="$q.screen.height - usedHeight > THRESHOLD" :style="scrollAreaStyle">
      <main-content
        v-model:tab="tab"
        :weather-data="weatherData"
        :tab-items="tabItems"
        :directory-data="directoryData"
        :resources-data="resourcesData"
        :sight-seeing-data="sightSeeingData"
        @update:current-tab="setTab"
        @on-search="handleSearchDialog"
        @on-directory-item="onDirectoryItem"
      />
    </q-scroll-area>

    <main-content
      v-else
      v-model:tab="tab"
      :weather-data="weatherData"
      :tab-items="tabItems"
      :directory-data="directoryData"
      :resources-data="resourcesData"
      :sight-seeing-data="sightSeeingData"
      @update:current-tab="setTab"
      @on-search="handleSearchDialog"
      @on-directory-item="onDirectoryItem"
    />
  </q-page>
</template>

<script setup lang="ts">
  // Interface files
  import type { SiteDirectory } from "@/interfaces/models/entities/site-directory";
  import type { SiteView } from "@/interfaces/models/views/site-view";
  import type { TabItem } from "@/interfaces/tab-item";
  import type { Weather } from "@/interfaces/models/entities/weather";

  // .ts file
  import { ENTITY_URL, EntityURLKey } from "@/constants";

  // Custom Components
  const mainContent = defineAsyncComponent(() => import("./components/main-content.vue"));

  // Props
  const { entityKey } = defineProps<{
    entityKey: EntityURLKey;
  }>();

  
  const $q = useQuasar();
  const { t } = useI18n({ useScope: "global" });
  const { fetchData } = useApi();
  const { openCategoryItemDialog, openCategoryDetailDialog } = useCategoryDialogService(entityKey);
  const { eventBus } = useUtilities();
  
  const THRESHOLD = 320;
  const attractions = ref<SiteView[]>([]);
  const homeDirectories = ref<SiteDirectory[]>([]);
  const weatherData = ref<Weather | null>(null);
  const error = ref<string | null>(null);

  const setTab = (val: string) => (tab.value = val);
  const tab = ref("all");
  const i18nKey = "home";

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
    { name: "all", label: t(`${i18nKey}.tabItem.allLocations`) },
    { name: "resources", label: t(`${i18nKey}.tabItem.resources`) },
    { name: "sightSeeing", label: t(`${i18nKey}.tabItem.sightSeeing`) }
  ]);

  const directoryData = computed(() =>
    homeDirectories.value.filter((dir: SiteDirectory) => dir.groupId == 1)
  );

  const resourcesData = computed(() =>
    homeDirectories.value.filter((dir: SiteDirectory) => dir.groupId == 3)
  );

  const sightSeeingData = computed(() =>
    homeDirectories.value.filter((dir: SiteDirectory) => dir.groupId == 5)
  );

  function handleSearchDialog(value: any) {
    $q.dialog({
      component: defineAsyncComponent(
        () => import("@/components/dialog/catergory-items-search-dialog/index.vue")
      ),
      componentProps: {
        query: { searchKeyword: value },
        entityKey: "SITE"
      }
    }).onDismiss(() => {
      eventBus("ClearInput").emit();
    });
  }

  async function fetchAllData() {
    try {
      const [attractionResponse, weatherResponse, homeDirectoryResponse] = await Promise.all([
        fetchData(ENTITY_URL.ATTRACTION),
        fetchData(ENTITY_URL.WEATHER),
        fetchData(ENTITY_URL.SITE_DIRECTORIES)
      ]);

      weatherData.value = weatherResponse;
      homeDirectories.value = homeDirectoryResponse.filter(
        (dir: SiteDirectory) => dir.status === 1
      );
      attractions.value = attractionResponse
        .sort((a: any, b: any) => a.siteId - b.siteId)
        .slice(0, 10);
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

  const onImageClick = (category: SiteView) => {
    const dialogName = "SiteHeroDetail";
    eventBus("DialogStatus").emit(true, dialogName);
    openCategoryDetailDialog(category, dialogName, entityKey);
  };

  async function onDirectoryItem(directory: SiteDirectory) {
    if (isDialogOpen.value) return;
    const dialogName = "SiteItemList";
    eventBus("DialogStatus").emit(true, dialogName);
    openCategoryItemDialog(isDialogOpen, directory, dialogName);
  }

  /**
   * Fetch data as part of the setup
   * This ensures that the component is compatible with Suspense
   */
  await fetchAllData();
</script>
