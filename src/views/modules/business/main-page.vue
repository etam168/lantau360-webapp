<template>
  <q-page>
    <app-bar-title :title="$t(`${i18nKey}.advertisement`)" />
    <app-carousel-section :data="advertisements" @image-click="onImageClick" />

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
        <app-marketing-item-list :data="businessPromotion" :entity-key="'BUSINESS_PROMOTION'" />
      </q-tab-panel>

      <q-tab-panel name="directory">
        <q-card-actions align="center">
          <app-search-bar @on-search="handleSearchDialog" />
        </q-card-actions>

        <app-directory-items :data="directoryData" @on-directory-item="onDirectoryItem" />
      </q-tab-panel>
    </q-tab-panels>
  </q-page>
</template>

<script setup lang="ts">
  // Interface files
  import type { AdvertisementView } from "@/interfaces/models/views/advertisement-view";
  import type { BusinessPromotionView } from "@/interfaces/models/views/business-promotion-view";
  import type { BusinessVoucherView } from "@/interfaces/models/views/business-voucher-view";
  import type { Directory } from "@/interfaces/models/entities/directory";
  import type { TabItem } from "@/interfaces/tab-item";

  // .ts file
  import { ENTITY_URL, EntityURLKey } from "@/constants";

  // Props
  const { entityKey } = defineProps<{
    entityKey: EntityURLKey;
  }>();

  const $q = useQuasar();
  const { t } = useI18n({ useScope: "global" });
  const { fetchData } = useApi();
  const { openCategoryDetailDialog, openCategoryItemDialog } = useCategoryDialogService(entityKey);
  const { eventBus, isSmallScreen, getEntityName } = useUtilities();

  const titleClass = computed(() => (isSmallScreen.value ? "text-center" : ""));
  const tabSelectClass = computed(() => (isSmallScreen.value ? "q-mt-xs flex justify-center" : ""));

  const advertisements = ref<AdvertisementView[]>([]);
  const businessDirectories = ref<Directory[]>([]);
  const businessPromotion = ref<BusinessPromotionView[]>([]);
  const businessVoucher = ref<BusinessVoucherView[]>([]);

  const dialogStack = ref<string[]>([]);
  const error = ref<string | null>(null);

  const setTab = (val: string) => (tab.value = val);
  const tab = ref("promotion");
  const i18nKey = getEntityName(entityKey);

  const isDialogOpen = ref(false);

  const tabItems = ref<TabItem[]>([
    { name: "promotion", label: t(`${i18nKey}.tabItem.promotion`) },
    { name: "directory", label: t(`${i18nKey}.tabItem.directory`) }
  ]);

  const directoryData = computed(() =>
    businessDirectories.value.filter((dir: Directory) => [2, 4].includes(dir.groupId))
  );

  function handleSearchDialog(value: any) {
    $q.dialog({
      component: defineAsyncComponent(
        () => import("@/components/dialog/catergory-items-search-dialog/index.vue")
      ),
      componentProps: {
        query: { searchKeyword: value },
        entityKey: entityKey
      }
    });
  }

  async function fetchAllData() {
    try {
      const [
        advertisementResponse,
        promotionsResponse,
        voucherResponse,
        businessDirectoryResponse
      ] = await Promise.all([
        fetchData(ENTITY_URL.ADVERTISEMENT),
        fetchData(ENTITY_URL.BUSINESS_PROMOTION),
        fetchData(ENTITY_URL.BUSINESS_VOUCHER),
        fetchData(ENTITY_URL.BUSINESS_DIRECTORIES)
      ]);

      advertisements.value = advertisementResponse.filter(
        (adv: AdvertisementView) => adv.status === 1
      );

      businessPromotion.value = promotionsResponse.data.filter(
        (promo: BusinessPromotionView) => promo.status === 1
      );

      businessVoucher.value = voucherResponse.data.filter(
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
        error.value = t("errors.anErrorOccured");
      }
    }
  }
  const test = ref();
  const onImageClick = (item: AdvertisementView) => {
    test.value = item;
    const dialogName = "AdvertisementDetail";
    eventBus("DialogStatus").emit(true, dialogName);
    openCategoryDetailDialog(item, dialogName, "ADVERTISEMENT");
  };

  async function onDirectoryItem(directory: Directory) {
    if (isDialogOpen.value) return;
    const dialogName = "BusinessItemListDialog";
    eventBus("DialogStatus").emit(true, dialogName);
    openCategoryItemDialog(isDialogOpen, directory, dialogName);
  }

  onMounted(() => {
    eventBus("DialogStatus").on((status: any, emitter: string) => {
      if (status) {
        dialogStack.value.push(emitter);
      } else {
        dialogStack.value.pop();
      }
    });
  });

  onBeforeRouteLeave((_to, _from, next) => {
    if (dialogStack.value.length > 0) {
      const emitter = dialogStack.value[dialogStack.value.length - 1];
      eventBus(emitter).emit();
      dialogStack.value.pop();
      next(false);
    } else {
      next();
    }
  });

  /**
   * Fetch data as part of the setup
   * This ensures that the component is compatible with Suspense
   */
  await fetchAllData();
</script>
