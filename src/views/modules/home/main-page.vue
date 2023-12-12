<template>
  <q-page>
    <carousel-section :data="carouselData" />
    <weather-section :data="weatherData" />

    <q-separator size="2px" inset spaced color="primary" />

    <app-tab-select :tab-items="tabItems" :current-tab="tab" @update:currentTab="setTab" />

    <q-card-actions align="center">
      <app-search-bar @on-search="handleSearchDialog" />
    </q-card-actions>

    <app-tab-panels v-model="tab">
      <q-tab-panel name="all">
        <directory-section :data="directoriesData" />
      </q-tab-panel>

      <q-tab-panel name="info">
        <directory-section :data="infoData" />
      </q-tab-panel>
    </app-tab-panels>
  </q-page>
</template>

<script setup lang="ts">
  // Vue Import
  import { defineAsyncComponent, onMounted, ref } from "vue";
  import { onBeforeRouteLeave } from "vue-router";

  // 3rd Party Import
  import axios, { AxiosError } from "axios";
  import { useI18n } from "vue-i18n";
  import { useQuasar } from "quasar";

  // .ts file
  import { URL, DIRECTORY_GROUPS } from "@/constants";
  import { Site } from "@/interfaces/models/entities/site";
  import { Weather } from "@/interfaces/models/entities/weather";
  import { Directory } from "@/interfaces/models/entities/directory";
  import { useUtilities } from "@/composable/use-utilities";
  import { TabItem } from "@/interfaces/tab-item";
  import eventBus from "@/utils/event-bus";

  // Custom Components
  import DirectorySection from "./section/directory-section.vue";
  import CarouselSection from "./section/carousel-section.vue";
  import WeatherSection from "./section/weather-section.vue";

  const { isNthBitSet } = useUtilities();
  const { t } = useI18n({ useScope: "global" });
  const $q = useQuasar();

  const carouselData = ref<any | null>(null);
  const directoriesData = ref();
  const infoData = ref();
  const weatherData = ref<any | null>(null);
  const dialogStack = ref<string[]>([]);

  const error = ref<string | null>(null);

  const setTab = (val: string) => (tab.value = val);
  const tab = ref("all");
  const tabItems = ref<TabItem[]>([
    { name: "all", label: t("home.allLocations") },
    { name: "info", label: t("home.info") }
  ]);

  function handleSearchDialog(value: any) {
    $q.dialog({
      component: defineAsyncComponent(() => import("./search-site/index.vue")),
      componentProps: {
        query: { searchKeyword: value }
      }
    });
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

  try {
    const [attractionResponse, weatherResponse, homeDirectories] = await Promise.all([
      axios.get<Site[]>(URL.ATTRACTION_URL),
      axios.get<Weather>(URL.WEATHER_URL),
      axios.get<Directory[]>(`${URL.MAIN_DIRECTORIES}/${DIRECTORY_GROUPS.HOME}`)
    ]);

    carouselData.value = attractionResponse.data;
    weatherData.value = weatherResponse.data;

    directoriesData.value = homeDirectories.data.filter((directory: Directory) => {
      return isNthBitSet(directory.displayMask, 1);
    });

    infoData.value = homeDirectories.data.filter((directory: Directory) => {
      return isNthBitSet(directory.displayMask, 2);
    });
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
