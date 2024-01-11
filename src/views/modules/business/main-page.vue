<template>
  <q-page>
    <app-carousel-section :data="advertisements" />

    <q-banner :inline-actions="!isSmallScreen">
      <q-toolbar-title :class="titleClass">{{ $t("business.title") }}</q-toolbar-title>

      <template v-slot:action>
        <app-tab-select
          :class="tabSelectClass"
          :tab-items="tabItems"
          :current-tab="tab"
          @update:currentTab="setTab"
        />
      </template>
    </q-banner>

    <app-tab-panels v-model="tab">
      <q-tab-panel name="promotion" class="q-pa-sm">
        <app-marketing-item-list :items="businessPromotion" />
      </q-tab-panel>

      <q-tab-panel name="directory">
        <q-card-actions align="center">
          <app-search-bar @on-search="handleSearchDialog" />
        </q-card-actions>

        <app-directory-section :data="directoriesData" class="q-my-sm" />
      </q-tab-panel>
    </app-tab-panels>
  </q-page>
</template>

<script setup lang="ts">
  // Interface files
  import { AdvertisementView } from "@/interfaces/models/views/advertisement-view";
  import { BusinessPromotionView } from "@/interfaces/models/views/business-promotion-view";
  import { BusinessVoucherView } from "@/interfaces/models/views/business-voucher-view";
  import { Directory } from "@/interfaces/models/entities/directory";
  import { TabItem } from "@/interfaces/tab-item";

  // .ts file
  import { URL } from "@/constants";

  const { t } = useI18n({ useScope: "global" });
  const $q = useQuasar();
  const { eventBus, isSmallScreen } = useUtilities();

  const titleClass = computed(() => (isSmallScreen.value ? "text-center" : ""));
  const tabSelectClass = computed(() => (isSmallScreen.value ? "q-mt-xs flex justify-center" : ""));

  const advertisements = ref<AdvertisementView[]>([]);
  const directoriesData = ref<Directory[]>([]);
  const businessPromotion = ref<BusinessPromotionView[]>([]);
  const businessVoucher = ref<BusinessVoucherView[]>([]);

  const dialogStack = ref<string[]>([]);
  const error = ref<string | null>(null);

  const setTab = (val: string) => (tab.value = val);
  const tab = ref("promotion");
  const tabItems = ref<TabItem[]>([
    { name: "promotion", label: t("business.tabItems.promotion") },
    { name: "directory", label: t("business.tabItems.directory") }
  ]);

  function handleSearchDialog(value: any) {
    $q.dialog({
      component: defineAsyncComponent(() => import("./search-business/index.vue")),
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
    const [advertisementResponse, promotionsResponse, voucherResponse, directoriesResponse] =
      await Promise.all([
        axios.get(URL.ADVERTISEMENT),
        axios.get(URL.BUSINESS_PROMOTION),
        axios.get(URL.BUSINESS_VOUCHER),
        axios.get(URL.BUSINESS_DIRECTORIES)
      ]);

    advertisements.value = advertisementResponse.data;
    businessPromotion.value = promotionsResponse.data.data;
    businessVoucher.value = voucherResponse.data.data;
    directoriesData.value = useSorted(
      directoriesResponse.data,
      (a, b) => a.rank - b.rank
    ).value.filter((dir: Directory) => dir.status === 1);
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
