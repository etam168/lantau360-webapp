<template>
  <carousel-section :data="carouselData" />
  <weather-section :data="weatherData" />

  <q-separator size="2px" inset spaced color="primary" />

  <q-toolbar class="text-white">
    <q-chip
      v-for="(tabItem, index) in tabItems"
      :key="index"
      :outline="tab !== tabItem.name"
      color="primary"
      text-color="white"
      clickable
      @click="setTab(tabItem.name)"
    >
      {{ tabItem.label }}
    </q-chip>
  </q-toolbar>

  <q-tab-panels
    v-model="tab"
    animated
    transition-prev="fade"
    transition-next="fade"
    transition-duration="1000"
  >
    <q-tab-panel name="all">
      <directory-section :data="directoriesData" />
    </q-tab-panel>

    <q-tab-panel name="info">
      <directory-section :data="infoData" />

      <div class="row justify-center q-ma-lg">
        <custom-search-bar @on-search="handleSearch" />
      </div>
    </q-tab-panel>
  </q-tab-panels>
</template>

<script setup lang="ts">
  // Vue Import
  import { ref } from "vue";
  import { useRouter } from "vue-router";

  // 3rd Party Import
  import axios, { AxiosError } from "axios";
  import { useI18n } from "vue-i18n";

  // .ts file
  import { Site } from "@/interfaces/models/entities/site";
  import { ATTRACTION_URL, WEATHER_URL, MAIN_DIRECTORIES, DIRECTORY_GROUPS } from "@/constants";
  import { Weather } from "@/interfaces/models/entities/weather";
  import { Directory } from "@/interfaces/models/entities/directory";
  import { useUtilities } from "@/composable/use-utilities";

  // Custom Components
  import CustomSearchBar from "@/components/custom/custom-search-bar.vue";
  import DirectorySection from "./section/directory-section.vue";
  import CarouselSection from "./section/carousel-section.vue";
  import WeatherSection from "./section/weather-section.vue";

  const { isNthBitSet } = useUtilities();
  const { t } = useI18n({ useScope: "global" });

  const router = useRouter();
  const tab = ref("all");

  const error = ref<string | null>(null);
  const carouselData = ref<any | null>(null);

  const directoriesData = ref();
  const infoData = ref();
  const weatherData = ref<any | null>(null);

  const tabItems = ref([
    { name: "all", label: t("home.allLocations") },
    { name: "info", label: t("home.info") }
  ]);

  function handleSearch(value: string) {
    const queryString = { searchKeyword: value };
    router.push({ name: "SitesSeacrh", query: queryString });
  }

  function setTab(val: string) {
    tab.value = val;
  }

  try {
    const [attractionResponse, weatherResponse, homeDirectories] = await Promise.all([
      axios.get<Site[]>(ATTRACTION_URL),
      axios.get<Weather>(WEATHER_URL),
      axios.get<Directory[]>(`${MAIN_DIRECTORIES}/${DIRECTORY_GROUPS.HOME}`)
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
