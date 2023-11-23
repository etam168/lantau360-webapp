<template>
  <!-- <hero-section :data="heroData" />

  <weather-section :data="weatherData" /> -->

  <top-section :data="directoriesData" class="q-mb-md" />
  <ad-section :data="promotions" />
  <!-- <latest-offer /> -->
</template>
<!-- eslint-disable @typescript-eslint/no-unused-vars -->
<script setup lang="ts">
  // Vue Import
  import { provide, ref } from "vue";

  // 3rd Party Import
  import axios, { AxiosError } from "axios";

  // .ts file
  import { Site } from "@/interfaces/models/entities/site";
  import { MAIN_DIRECTORIES, PROMOTION_URL } from "@/constants";

  // Custom Components
  // import HeroSection from "./section/hero-section.vue";
  // import weatherSection from "./section/weather-section.vue";
  import TopSection from "./section/top-section.vue";
  import AdSection from "./section/ad-section.vue";
  import LatestOffer from "./section/latest-offer-section.vue";
  import { Directory } from "@/interfaces/models/entities/directory";

  const promotions = ref<any | null>(null);
  const directoriesData = ref();
  const error = ref<string | null>(null);

  try {
    const [respPromotions, respDirectories] = await Promise.all([
      axios.get(`${PROMOTION_URL}/108`),
      axios.get<Directory>(`${MAIN_DIRECTORIES}/2`)
    ]);
    promotions.value = respPromotions.data.data;
    directoriesData.value = respDirectories.data;
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
