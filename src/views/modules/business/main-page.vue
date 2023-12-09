<template>
  <app-page-title :title="$t('business.title')"></app-page-title>
  <carousel-section :data="advertisements" />
  <app-tab-select :tab-items="tabItems" :current-tab="tab" @update:currentTab="setTab" />

  <app-tab-panels v-model="tab">
    <q-tab-panel name="promotion">
      <promotion-section :offers="businessPromotion" />
    </q-tab-panel>

    <q-tab-panel name="voucher">
      <voucher-card-section :offers="businessVoucher" />
    </q-tab-panel>

    <q-tab-panel name="directory">
      <app-search-bar @search="handleSearchDialog" />
      <directory-section :data="directoriesData" class="q-my-sm" />
    </q-tab-panel>
  </app-tab-panels>
</template>

<script setup lang="ts">
  // Vue Import
  import { defineAsyncComponent, onMounted, ref } from "vue";
  import { onBeforeRouteLeave } from "vue-router";

  // 3rd Party Import
  import axios, { AxiosError } from "axios";
  import { useI18n } from "vue-i18n";
  import { useQuasar } from "quasar";

  // .ts file
  import { URL } from "@/constants";
  import { Directory } from "@/interfaces/models/entities/directory";
  import { TabItem } from "@/interfaces/tab-item";
  import eventBus from "@/utils/event-bus";

  // Custom Components
  const CarouselSection = defineAsyncComponent(() => import("./section/carousel-section.vue"));
  const DirectorySection = defineAsyncComponent(() => import("./section/directory-section.vue"));
  const PromotionSection = defineAsyncComponent(() => import("./section/promotion-section.vue"));
  const VoucherCardSection = defineAsyncComponent(() => import("./section/voucher-section.vue"));

  const { t } = useI18n({ useScope: "global" });
  const $q = useQuasar();

  const advertisements = ref<any | null>(null);
  const directoriesData = ref();
  const businessPromotion = ref();
  const businessVoucher = ref();
  const dialogStack = ref<string[]>([]);

  const error = ref<string | null>(null);

  const setTab = (val: string) => (tab.value = val);
  const tab = ref("promotion");
  const tabItems = ref<TabItem[]>([
    { name: "promotion", label: t("business.tabItems.promotion") },
    { name: "voucher", label: t("business.tabItems.voucher") },
    { name: "directory", label: t("business.tabItems.directory") }
  ]);

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

  try {
    const [respAdvertisement, respPromotions, respBusinessVoucher, respDirectories] =
      await Promise.all([
        axios.get(`${URL.ADVERTISEMENT}`),
        axios.get(`${URL.BUSINESS_PROMOTION}`),
        axios.get(`${URL.BUSINESS_VOUCHER}`),
        axios.get<Directory>(`${URL.BUSINESS_DIRECTORY}`)
      ]);

    advertisements.value = respAdvertisement.data;
    businessPromotion.value = respPromotions.data.data;
    businessVoucher.value = respBusinessVoucher.data.data;
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
