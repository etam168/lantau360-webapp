<template>
  <q-page>
    <app-carousel-section :data="attractions" @image-click="onImageClick" />
    <weather-section :data="weatherData" />

    <main-content
      :directory-data="directoryData"
      :resources-data="resourcesData"
      :sight-seeing-data="sightSeeingData"
      :entityKey
      :i18nKey
    />
  </q-page>
</template>

<script setup lang="ts">
  // Interface files
  import type { SiteDirectory } from "@/interfaces/models/entities/site-directory";
  import type { SiteView } from "@/interfaces/models/views/site-view";
  import type { Weather } from "@/interfaces/models/entities/weather";

  // .ts file
  import { ENTITY_URL, EntityURLKey } from "@/constants";

  // Custom Components
  import MainContent from "./components/main-content.vue";
  const weatherSection = defineAsyncComponent(() => import("./components/weather-section.vue"));

  // Props
  const { entityKey, i18nKey = "home" } = defineProps<{
    entityKey: EntityURLKey;
    i18nKey?: string;
  }>();

  const { t } = useI18n({ useScope: "global" });
  const { fetchData } = useApi();
  const { openCategoryDetailDialog } = useCategoryDialogService(entityKey);

  const attractions = ref<SiteView[]>([]);
  const homeDirectories = ref<SiteDirectory[]>([]);
  const weatherData = ref<Weather | null>(null);
  const error = ref<string | null>(null);

  const directoryData = computed(() =>
    homeDirectories.value.filter((dir: SiteDirectory) => dir.groupId == 1)
  );

  const resourcesData = computed(() =>
    homeDirectories.value.filter((dir: SiteDirectory) => dir.groupId == 3)
  );

  const sightSeeingData = computed(() =>
    homeDirectories.value.filter((dir: SiteDirectory) => dir.groupId == 5)
  );

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
    openCategoryDetailDialog(category, entityKey);
  };

  /**
   * Fetch data as part of the setup
   * This ensures that the component is compatible with Suspense
   */
  await fetchAllData();
</script>
