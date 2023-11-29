<template>
  <hero-section :data="heroData" />
  <weather-section :data="weatherData" />
  <q-tabs
    v-model="tab"
    dense
    class="text-grey"
    active-color="primary"
    indicator-color="primary"
    align="justify"
    narrow-indicator
  >
    <q-tab name="allLocations" label="All Locations" />
    <q-tab name="info" label="Info" />
  </q-tabs>

  <q-separator />

  <q-tab-panels v-model="tab" animated>
    <q-tab-panel name="allLocations">
      <directory-section :data="directoriesData" class="q-my-md" />
    </q-tab-panel>

    <q-tab-panel name="info">
      <custom-search-bar @on-search="handleSearch" />
      <!-- <top-directory-section class="q-mb-md" /> -->
      <directory-section :data="infoData" class="q-my-md" />
    </q-tab-panel>
  </q-tab-panels>
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
  import CustomSearchBar from "@/components/custom/custom-search-bar.vue";
  // import TopDirectorySection from "./section/top-directory-section.vue";

  const router = useRouter();
  const tab = ref("allLocations");
  // const keyword = ref("");
  const heroData = ref<any | null>(null);
  const filteredheroData = ref<any | null>(null);
  const weatherData = ref<any | null>(null);
  const directoriesData = ref();
  // const allLocationsData = ref();
  const infoData = ref();
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
    infoData.value = directoriesData.value.filter((directory: Directory) => {
      return directory.displayMask === 1 || directory.displayMask === 3;
    });
    filteredheroData.value = heroData.value.filter((directory: Directory) => {
      return directory.displayMask === 2 || directory.displayMask === 3;
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

  function handleSearch(value: string) {
    const queryString = { searchKeyword: value };
    router.push({ name: "SitesSeacrh", query: queryString });
  }
</script>
