<template>
  <top-section :data="directoriesData" class="q-mb-md" />
  <latest-offer />
</template>

<script setup lang="ts">
  // Vue Import
  import { ref } from "vue";

  // 3rd Party Import
  import axios, { AxiosError } from "axios";

  // .ts file
  import { Site } from "@/interfaces/models/entities/site";
  import { ATTRACTION_URL, HOME_DIRECTORY } from "@/constants";

  // Custom Components
  import { Directory } from "@/interfaces/models/entities/directory";
  import LatestOffer from "./section/latest-offer-section.vue";
  import TopSection from "./section/top-section.vue";

  const heroData = ref<any | null>(null);
  const directoriesData = ref();
  const error = ref<string | null>(null);

  try {
    const [attractionResponse, homeDirectories] = await Promise.all([
      axios.get<Site[]>(ATTRACTION_URL),
      // axios.get<Weather>(WEATHER_URL),
      axios.get<Directory>(HOME_DIRECTORY)
    ]);
    heroData.value = attractionResponse.data;
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
