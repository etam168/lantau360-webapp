<template>
  <q-card-actions align="center">
    <div class="text-h6 text-weight-medium">{{ $t("business.title") }}</div>
  </q-card-actions>

  <carousel-section :data="promotions" />

  <q-toolbar class="text-white bg-grey-3">
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
    <q-tab-panel name="promotion">
      <latest-offer-section :offers="latestOffers" />
    </q-tab-panel>

    <q-tab-panel name="voucher">
      <voucher-card-section :offers="latestOffers" />
    </q-tab-panel>

    <q-tab-panel name="directory">
      <q-toolbar>
        <custom-search-input v-model="keyword" @search="handleSearch" />
      </q-toolbar>
      <directories :data="directoriesData" class="q-mb-md" />
    </q-tab-panel>
  </q-tab-panels>
</template>

<script setup lang="ts">
  // Vue Import
  import { defineAsyncComponent, ref } from "vue";
  import { useRouter } from "vue-router";

  // 3rd Party Import
  import axios, { AxiosError } from "axios";
  import { useI18n } from "vue-i18n";

  // .ts file
  import { DIRECTORY_GROUPS, MAIN_DIRECTORIES, PROMOTION_URL } from "@/constants";
  import { Directory } from "@/interfaces/models/entities/directory";

  // Custom Components
  import CustomSearchInput from "@/components/custom/custom-search-input.vue";

  const CarouselSection = defineAsyncComponent(() => import("./section/carousel-section.vue"));
  const Directories = defineAsyncComponent(() => import("./section/directories-section.vue"));
  const LatestOfferSection = defineAsyncComponent(
    () => import("./section/latest-offer-section.vue")
  );
  const VoucherCardSection = defineAsyncComponent(() => import("./section/voucher-section.vue"));

  const router = useRouter();
  const { t } = useI18n({ useScope: "global" });

  const tab = ref("promotion");
  const keyword = ref("");
  const promotions = ref<any | null>(null);
  const directoriesData = ref();
  const latestOffers = ref();

  const error = ref<string | null>(null);

  const tabItems = ref([
    { name: "promotion", label: t("business.tabItems.promotion") },
    { name: "voucher", label: t("business.tabItems.voucher") },
    { name: "directory", label: t("business.tabItems.directory") }
  ]);

  function handleSearch() {
    const queryString = { searchKeyword: keyword.value };
    router.push({ name: "BusinessSeacrh", query: queryString });
  }

  function setTab(val: string) {
    tab.value = val;
  }

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
</script>
