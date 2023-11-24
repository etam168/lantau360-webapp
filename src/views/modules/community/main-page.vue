<template>
  <directories :data="directoriesData" class="q-mb-md" />
  <promotions :data="promotions" />
  <!-- <latest-offer :offers="latestOffers" /> -->
</template>
<!-- eslint-disable @typescript-eslint/no-unused-vars -->
<script setup lang="ts">
  // Vue Import
  import { ref } from "vue";

  // 3rd Party Import
  import axios, { AxiosError } from "axios";

  // .ts file
  import { COMMUNITY_DIRECTORY, PROMOTION_URL } from "@/constants";

  import Directories from "./section/directories-section.vue";
  import Promotions from "./section/promotion-section.vue";
  import LatestOffer from "./section/latest-offer-section.vue";
  import { Directory } from "@/interfaces/models/entities/directory";

  const promotions = ref<any | null>(null);
  const directoriesData = ref();
  const latestOffers = ref();

  const error = ref<string | null>(null);

  try {
    const [respPromotions, respLatestOffers, respDirectories] = await Promise.all([
      axios.get(`${PROMOTION_URL}/108`),
      axios.get(`${PROMOTION_URL}/100`),
      axios.get<Directory>(`${COMMUNITY_DIRECTORY}`)
    ]);
    promotions.value = respPromotions.data.data;
    latestOffers.value = respLatestOffers.data.data;
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
