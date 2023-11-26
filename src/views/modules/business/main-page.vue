<template>
  <q-toolbar
    class="q-pa-none bg-grey-3 q-ma-lg"
    style="overflow: hidden; border-radius: 24px; height: 48px; max-width: 960px"
  >
    <q-separator vertical />
    <custom-search-input v-model="keyword" @search="handleSearch" />
  </q-toolbar>
  <directories :data="directoriesData" class="q-mb-md" />
  <promotions :data="promotions" />
  <latest-offer :offers="latestOffers" />
</template>
<!-- eslint-disable @typescript-eslint/no-unused-vars -->
<script setup lang="ts">
  // Vue Import
  import { ref } from "vue";
  import { useRouter } from "vue-router";

  // 3rd Party Import
  import axios, { AxiosError } from "axios";

  // .ts file
  import { DIRECTORY_GROUPS, MAIN_DIRECTORIES, PROMOTION_URL } from "@/constants";

  import Directories from "./section/directories-section.vue";
  import CustomSearchInput from "@/components/custom/custom-search-input.vue";
  import Promotions from "./section/promotion-section.vue";
  import LatestOffer from "./section/latest-offer-section.vue";
  import { Directory } from "@/interfaces/models/entities/directory";

  const router = useRouter();

  const keyword = ref("");
  const promotions = ref<any | null>(null);
  const directoriesData = ref();
  const latestOffers = ref();

  const error = ref<string | null>(null);

  try {
    const [respPromotions, respLatestOffers, respDirectories] = await Promise.all([
      axios.get(`${PROMOTION_URL}/${DIRECTORY_GROUPS.PROMOTIONS}`),
      axios.get(`${PROMOTION_URL}/${DIRECTORY_GROUPS.LATEST_OFFERS}`),
      axios.get<Directory>(`${MAIN_DIRECTORIES}/${DIRECTORY_GROUPS.BUSINESS}`)
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

  function handleSearch() {
    const queryString = { searchKeyword: keyword.value };
    router.push({ name: "BusinessSeacrh", query: queryString });
  }
</script>
