<template>
  <q-page>
    <app-carousel-section :data="attractions" />
    <weather-section :data="weatherData" />
    <app-tab-select :tab-items="tabItems" :current-tab="tab" @update:currentTab="setTab" />

    <q-card-actions align="center">
      <app-search-bar @on-search="handleSearchDialog" />
    </q-card-actions>

    <q-tab-panels v-model="tab">
      <q-tab-panel name="all">
        <app-directory-section :data="directoryData" />
      </q-tab-panel>

      <q-tab-panel name="info">
        <app-directory-section :data="infoData" />
      </q-tab-panel>

      <q-tab-panel name="tripAdvisor">
        <app-directory-section :data="tripAdvisorData" />
      </q-tab-panel>
    </q-tab-panels>
  </q-page>
</template>

<script setup lang="ts">
  // Interface files
  import { Directory } from "@/interfaces/models/entities/directory";
  import { SiteView } from "@/interfaces/models/views/site-view";
  import { TabItem } from "@/interfaces/tab-item";
  import { Weather } from "@/interfaces/models/entities/weather";

  // .ts file
  import { URL } from "@/constants";

  // Custom Components
  const weatherSection = defineAsyncComponent(() => import("./section/weather-section.vue"));

  const { isNthBitSet, eventBus } = useUtilities();
  const { t } = useI18n({ useScope: "global" });
  const $q = useQuasar();

  const attractions = ref<SiteView[]>([]);
  const homeDirectories = ref<Directory[]>([]);
  const weatherData = ref<Weather | null>(null);

  const dialogStack = ref<string[]>([]);
  const error = ref<string | null>(null);

  const setTab = (val: string) => (tab.value = val);
  const tab = ref("all");
  const tabItems = ref<TabItem[]>([
    { name: "all", label: t("home.allLocations") },
    { name: "info", label: t("home.info") },
    { name: "tripAdvisor", label: t("home.tripAdvisor") }
  ]);

  const directoryData = computed(() =>
    homeDirectories.value.filter((dir: Directory) => isNthBitSet(dir.displayMask, 1))
  );

  const infoData = computed(() =>
    homeDirectories.value.filter((dir: Directory) => isNthBitSet(dir.displayMask, 2))
  );

  const tripAdvisorData = computed(() =>
    homeDirectories.value.filter((dir: Directory) => isNthBitSet(dir.displayMask, 2))
  );

  function handleSearchDialog(value: any) {
    $q.dialog({
      component: defineAsyncComponent(() => import("./search-site/index.vue")),
      componentProps: {
        query: { searchKeyword: value }
      }
    });
  }

  onMounted(() => {
    eventBus.on("DialogStatus", (status: any, emitter: string) => {
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
    const [attractionResponse, weatherResponse, homeDirectoryResponse] = await Promise.all([
      axios.get<SiteView[]>(URL.ATTRACTION_URL),
      axios.get(URL.WEATHER_URL),
      axios.get<Directory[]>(URL.SITE_DIRECTORIES)
    ]);

    attractions.value = attractionResponse.data.sort((a, b) => a.siteId - b.siteId);
    weatherData.value = weatherResponse.data;
    homeDirectories.value = useSorted(
      homeDirectoryResponse.data,
      (a, b) => a.rank - b.rank || a.directoryId - b.directoryId
    ).value.filter((dir: Directory) => dir.status === 1);
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
