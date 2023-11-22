<template>
  <hero-section :data="heroData" />

  <weather-section :data="weatherData" />
</template>
<!-- eslint-disable @typescript-eslint/no-unused-vars -->
<script setup lang="ts">
  // Vue Import
  import { provide, ref } from "vue";

  // 3rd Party Import
  import axios, { AxiosError } from "axios";

  // .ts file
  import { Site } from "@/interfaces/models/entities/site";
  import { ATTRACTION_URL, WEATHER_URL } from "@/constants";

  // Custom Components
  import HeroSection from "./section/hero-section.vue";
  import weatherSection from "./section/weather-section.vue";
  import { Weather } from "@/interfaces/models/entities/weather";

  const heroData = ref<any | null>(null);
  const weatherData = ref<any | null>(null);
  const error = ref<string | null>(null);

  try {
    const [attractionResponse, weatherResponse] = await Promise.all([
      axios.get<Site[]>(ATTRACTION_URL),
      axios.get<Weather>(WEATHER_URL)
    ]);
    heroData.value = attractionResponse.data;
    weatherData.value = weatherResponse.data;
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
