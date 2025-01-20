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
  // Types
  import type { SiteDirectory } from "@/interfaces/models/entities/site-directory";
  import type { SiteView } from "@/interfaces/models/views/site-view";
  import type { Weather } from "@/interfaces/models/entities/weather";

  // Constants
  import { ENTITY_URL, EntityURLKey } from "@/constants";

  // Custom Components
  import MainContent from "./components/main-content.vue";
  import WeatherSection from "./components/weather-section.vue";

  // Props
  const { entityKey } = defineProps<{
    entityKey: EntityURLKey;
  }>();

  const { t } = useI18n({ useScope: "global" });
  const { fetchData } = useApi();
  const { openCategoryDetailDialog } = useCategoryDialogService(entityKey);

  const attractions = ref<SiteView[]>([]);
  const homeDirectories = ref<SiteDirectory[]>([]);
  const weatherData = ref<Weather | null>(null);
  const error = ref<string | null>(null);

  const i18nKey = "home";

  const directoryData = computed(() =>
    homeDirectories.value.filter((dir: SiteDirectory) => dir.groupId == 1)
  );

  const resourcesData = computed(() =>
    homeDirectories.value.filter((dir: SiteDirectory) => dir.groupId == 3)
  );

  const sightSeeingData = computed(() =>
    homeDirectories.value.filter((dir: SiteDirectory) => dir.groupId == 5)
  );

  const onImageClick = (category: SiteView) => {
    openCategoryDetailDialog(category, entityKey);
  };

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

  /**
   * Fetch data as part of the setup
   * This ensures that the component is compatible with Suspense
   */
  await fetchAllData();
</script>
