<template>
  <app-page-title :title="$t('business.title')"></app-page-title>

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
      <q-toolbar class="q-pb-md row justify-center">
        <custom-search-bar @on-search="handleSearchDialog" />
      </q-toolbar>
      <directory-section :data="directoriesData" class="q-mb-md" />
    </q-tab-panel>
  </q-tab-panels>
</template>

<script setup lang="ts">
  // Vue Import
  import { defineAsyncComponent, onMounted, ref } from "vue";
  //import { useRouter } from "vue-router";

  // 3rd Party Import
  import axios, { AxiosError } from "axios";
  import { useI18n } from "vue-i18n";
  import { useQuasar } from "quasar";

  // .ts file
  import {
    ADVERTISEMENT_URL,
    DIRECTORY_GROUPS,
    MAIN_DIRECTORIES,
    BUSINESS_PROMOTION_URL
  } from "@/constants";
  import { Directory } from "@/interfaces/models/entities/directory";

  // Custom Components
  import CustomSearchBar from "@/components/custom/custom-search-bar.vue";
  import eventBus from "@/utils/event-bus";
  import { onBeforeRouteLeave } from "vue-router";

  const CarouselSection = defineAsyncComponent(() => import("./section/carousel-section.vue"));
  const DirectorySection = defineAsyncComponent(() => import("./section/directory-section.vue"));

  const LatestOfferSection = defineAsyncComponent(
    () => import("./section/latest-offer-section.vue")
  );
  const VoucherCardSection = defineAsyncComponent(() => import("./section/voucher-section.vue"));

  //const router = useRouter();
  const { t } = useI18n({ useScope: "global" });

  const tab = ref("promotion");
  const $q = useQuasar();

  //const keyword = ref("");
  const promotions = ref<any | null>(null);
  const directoriesData = ref();
  const latestOffers = ref();
  const dialogStack = ref<string[]>([]);

  // const $q = useQuasar();

  const error = ref<string | null>(null);

  const tabItems = ref([
    { name: "promotion", label: t("business.tabItems.promotion") },
    { name: "voucher", label: t("business.tabItems.voucher") },
    { name: "directory", label: t("business.tabItems.directory") }
  ]);

  // function handleSearch() {
  //   const queryString = { searchKeyword: keyword.value };
  //   router.push({ name: "BusinessSeacrh", query: queryString });
  // }

  function handleSearchDialog(value: any) {
    $q.dialog({
      component: defineAsyncComponent(() => import("../search-business/index.vue")),
      componentProps: {
        query: { searchKeyword: value }
      }
    });
  }

  onMounted(() => {
    eventBus.on("DialogStatus", (status, emitter) => {
      if (status) {
        dialogStack.value.push(emitter);
      } else {
        dialogStack.value = dialogStack.value.filter(item => item != emitter);
      }
    });
  });

  onBeforeRouteLeave((_to, _from, next) => {
    if (dialogStack.value.length > 0) {
      const emitter = dialogStack.value[dialogStack.value.length - 1];
      eventBus.emit(emitter);
      dialogStack.value = dialogStack.value.filter(item => item != emitter);

      next(false);
    } else {
      next();
    }
  });

  handleSearchDialog;

  function setTab(val: string) {
    tab.value = val;
  }
  try {
    const [respPromotions, respLatestOffers, respDirectories] = await Promise.all([
      axios.get(`${ADVERTISEMENT_URL}`),
      axios.get(`${BUSINESS_PROMOTION_URL}`),
      axios.get<Directory>(`${MAIN_DIRECTORIES}/${DIRECTORY_GROUPS.BUSINESS}`)
    ]);

    promotions.value = respPromotions.data;
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
