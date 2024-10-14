<template>
  <q-page>
    <q-bar dense class="bg-primary text-white">
      <div class="col text-center text-uppercase">{{ $t(`${i18nKey}.advertisement`) }}</div>
    </q-bar>

    <app-carousel-section :data="advertisements" :aspect-ratio="aspectRatio()" />
    <q-separator size="4px" color="primary" />
    <q-banner :inline-actions="!isSmallScreen">
      <q-toolbar-title :class="titleClass">{{ $t(`${i18nKey}.title`) }}</q-toolbar-title>

      <template v-slot:action>
        <app-tab-select
          :class="tabSelectClass"
          :tab-items="tabItems"
          :current-tab="tab"
          @update:currentTab="setTab"
        />
      </template>
    </q-banner>

    <q-tab-panels v-model="tab">
      <q-tab-panel name="promotion" class="q-pa-sm">
        <app-marketing-item-list :items="businessPromotion" />
      </q-tab-panel>

      <q-tab-panel name="directory">
        <q-card-actions align="center">
          <app-search-bar @on-search="handleSearchDialog" />
        </q-card-actions>

        <generic-directory-item-list :data="directoryData" @on-directory-item="onDirectoryItem" />
      </q-tab-panel>
    </q-tab-panels>
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
  import { EntityURLKey, URL } from "@/constants";

  const entityKey: EntityURLKey = "BUSINESS";

  const $q = useQuasar();
  const { t } = useI18n({ useScope: "global" });
  const { fetchData } = useApi();
  const { aspectRatio, eventBus, isSmallScreen } = useUtilities();
  const { openCategoryItemDialog } = useCategoryItemService(entityKey);

  const titleClass = computed(() => (isSmallScreen.value ? "text-center" : ""));
  const tabSelectClass = computed(() => (isSmallScreen.value ? "q-mt-xs flex justify-center" : ""));

  const advertisements = ref<AdvertisementView[]>([]);
  const businessDirectories = ref<Directory[]>([]);
  const businessPromotion = ref<BusinessPromotionView[]>([]);
  const businessVoucher = ref<BusinessVoucherView[]>([]);

  const dialogStack = ref<string[]>([]);
  const error = ref<string | null>(null);
  const isDialogOpen = ref(false);

  const setTab = (val: string) => (tab.value = val);
  const tab = ref("promotion");
  const i18nKey = "business";
  const tabItems = ref<TabItem[]>([
    { name: "promotion", label: t(`${i18nKey}.tabItem.promotion`) },
    { name: "directory", label: t(`${i18nKey}.tabItem.directory`) }
  ]);

  const directoryData = computed(() =>
    businessDirectories.value.filter((dir: Directory) => dir.groupId == 2)
  );

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

  async function fetchAllData() {
    try {
      const [
        advertisementResponse,
        promotionsResponse,
        voucherResponse,
        businessDirectoryResponse
      ] = await Promise.all([
        fetchData(URL.ADVERTISEMENT),
        fetchData(URL.BUSINESS_PROMOTION),
        fetchData(URL.BUSINESS_VOUCHER),
        fetchData(URL.BUSINESS_DIRECTORIES)
      ]);

      advertisements.value = advertisementResponse.filter(
        (adv: AdvertisementView) => adv.status === 1
      );

      businessPromotion.value = promotionsResponse.filter(
        (promo: BusinessPromotionView) => promo.status === 1
      );

      businessVoucher.value = voucherResponse.filter(
        (voucher: BusinessVoucherView) => voucher.status === 1
      );

      businessDirectories.value = businessDirectoryResponse.filter(
        (dir: Directory) => dir.status === 1
      );
    } catch (err) {
      if (err instanceof AxiosError) {
        if (err.response && err.response.status === 404) {
          error.value = t("errors.404");
        } else {
          error.value = t("errors.anErrorOccured");
        }
      } else {
        error.value = t("errors.anUnexpectedError");
      }
    }
  }

  async function onDirectoryItem(directory: Directory) {
    if (isDialogOpen.value) return;

    openCategoryItemDialog(isDialogOpen, directory);
  }

  await fetchAllData();
</script>
