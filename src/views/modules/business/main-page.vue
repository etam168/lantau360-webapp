<template>
  <q-page>
    <app-bar-title :title="$t(`${i18nKey}.advertisement`)" />
    <app-carousel-section :data="advertisements" @image-click="onImageClick" />
    <q-separator size="4px" color="primary" />

    <q-scroll-area v-if="$q.screen.height - usedHeight > THRESHOLD" :style="scrollAreaStyle">
      <main-content
        v-model:tab="tab"
        :tab-items="tabItems"
        :business-promotion="businessPromotion"
        :directory-data="businessDirectories"
        :entityKey
        :i18nKey
        @update:current-tab="setTab"
        @on-directory-item="onDirectoryItem"
      />
    </q-scroll-area>

    <main-content
      v-else
      v-model:tab="tab"
      :tab-items="tabItems"
      :business-promotion="businessPromotion"
      :directory-data="businessDirectories"
      :entityKey
      :i18nKey
      @update:current-tab="setTab"
      @on-directory-item="onDirectoryItem"
    />
  </q-page>
</template>

<script setup lang="ts">
  // Interface files
  import type { AdvertisementView } from "@/interfaces/models/views/advertisement-view";
  import type { BusinessDirectory } from "@/interfaces/models/entities/business-directory";
  import type { BusinessPromotionView } from "@/interfaces/models/views/business-promotion-view";
  import type { BusinessVoucherView } from "@/interfaces/models/views/business-voucher-view";
  import type { TabItem } from "@/interfaces/tab-item";

  // Custom Components
  import MainContent from "./components/main-content.vue";

  // Constants
  import { ENTITY_URL, EntityURLKey } from "@/constants";

  // Props
  const { entityKey } = defineProps<{
    entityKey: EntityURLKey;
  }>();

  const $q = useQuasar();
  const { t } = useI18n({ useScope: "global" });
  const { fetchData } = useApi();
  const { openCategoryDetailDialog, openCategoryItemDialog } = useCategoryDialogService(entityKey);
  const { getEntityName } = useUtilities();

  const THRESHOLD = 320;
  const advertisements = ref<AdvertisementView[]>([]);
  const businessDirectories = ref<BusinessDirectory[]>([]);
  const businessPromotion = ref<BusinessPromotionView[]>([]);
  const businessVoucher = ref<BusinessVoucherView[]>([]);
  const error = ref<string | null>(null);

  const setTab = (val: string) => (tab.value = val);
  const tab = ref("promotion");
  const i18nKey = getEntityName(entityKey);

  const isDialogOpen = ref(false);
  const usedHeight = computed(() => {
    const width = Math.min($q.screen.width, 1024);
    const carouselHeight = (width * 9) / 16; // Height for the carousel
    return carouselHeight + 105;
  });

  const scrollAreaStyle = computed(() => {
    return { height: `calc(100vh - ${usedHeight.value}px)` };
  });

  const tabItems = ref<TabItem[]>([
    { name: "promotion", label: t(`${i18nKey}.tabItem.promotion`) },
    { name: "directory", label: t(`${i18nKey}.tabItem.directory`) }
  ]);

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
        (dir: BusinessDirectory) => dir.status === 1
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

  const onImageClick = (category: AdvertisementView) => {
    openCategoryDetailDialog(category, dialogName, "ADVERTISEMENT");
  };

  async function onDirectoryItem(directory: BusinessDirectory) {
    if (!isDialogOpen.value) {
      openCategoryItemDialog(isDialogOpen, directory, "business");
    }
  }

  /**
   * Fetch data as part of the setup
   * This ensures that the component is compatible with Suspense
   */
  await fetchAllData();
</script>
