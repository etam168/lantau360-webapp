<template>
  <hero-section :data="heroData" />

  <weather-section :data="weatherData" />
  <top-directory-section :data="directoriesData" class="q-mb-md" />
  <q-toolbar
    class="q-pa-none bg-grey-3 q-ma-lg"
    style="overflow: hidden; border-radius: 24px; height: 48px; max-width: 960px"
  >
    <q-separator vertical />
    <custom-search-input v-model="keyword" @search="handleSearch" />
  </q-toolbar>

  <directory-section :data="directoriesData" class="q-mb-md" />
</template>

<script setup lang="ts">
  // Vue Import
  import { ref } from "vue";
  import { useRouter } from "vue-router";

  // 3rd Party Import
  import axios, { AxiosError } from "axios";

  // .ts file
  import { Site } from "@/interfaces/models/entities/site";
  import { ATTRACTION_URL, WEATHER_URL, MAIN_DIRECTORIES, DIRECTORY_GROUPS } from "@/constants";
  import { Weather } from "@/interfaces/models/entities/weather";
  import { Directory } from "@/interfaces/models/entities/directory";

  // Custom Components
  import HeroSection from "./section/hero-section.vue";
  import WeatherSection from "./section/weather-section.vue";
  import DirectorySection from "./section/directory-section.vue";
  import CustomSearchInput from "@/components/custom/custom-search-input.vue";
  import TopDirectorySection from "./section/top-directory-section.vue";

  const router = useRouter();

  const keyword = ref("");
  const heroData = ref<any | null>(null);
  const weatherData = ref<any | null>(null);
  const directoriesData = ref();
  const error = ref<string | null>(null);

  try {
    const [attractionResponse, weatherResponse, homeDirectories] = await Promise.all([
      axios.get<Site[]>(ATTRACTION_URL),
      axios.get<Weather>(WEATHER_URL),
      axios.get<Directory>(`${MAIN_DIRECTORIES}/${DIRECTORY_GROUPS.HOME}`)
    ]);
    heroData.value = attractionResponse.data;
    weatherData.value = weatherResponse.data;
    directoriesData.value = homeDirectories.data;
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

  function handleSearch() {
    const queryString = { searchKeyword: keyword.value };
    router.push({ name: "SitesSeacrh", query: queryString });
  }
</script>
