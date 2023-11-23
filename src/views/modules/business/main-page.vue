<template>
  <!-- <hero-section :data="heroData" />

  <weather-section :data="weatherData" /> -->

  <top-section :data="directoriesData" class="q-mb-md" />
  <ad-section />
  <latest-offer />
</template>
<!-- eslint-disable @typescript-eslint/no-unused-vars -->
<script setup lang="ts">
  // Vue Import
  import { provide, ref } from "vue";

  // 3rd Party Import
  import axios, { AxiosError } from "axios";

  // .ts file
  import { Site } from "@/interfaces/models/entities/site";
  import { ATTRACTION_URL, WEATHER_URL, MAIN_DIRECTORIES } from "@/constants";

  // Custom Components
  // import HeroSection from "./section/hero-section.vue";
  // import weatherSection from "./section/weather-section.vue";
  import TopSection from "./section/top-section.vue";
  import AdSection from "./section/ad-section.vue";
  import LatestOffer from "./section/latest-offer-section.vue";
  import { Weather } from "@/interfaces/models/entities/weather";
  import { Directory } from "@/interfaces/models/entities/directory";

  const heroData = ref<any | null>(null);
  const weatherData = ref<any | null>(null);
  const directoriesData = ref();
  const error = ref<string | null>(null);

  try {
    const [attractionResponse, weatherResponse, homeDirectories] = await Promise.all([
      axios.get<Site[]>(ATTRACTION_URL),
      axios.get<Weather>(WEATHER_URL),
      axios.get<Directory>(`${MAIN_DIRECTORIES}/2`)
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
</script>
