<template>
  <q-page>
    <app-bar-title :title="$t(`${i18nKey}.advertisement`)" />
    <app-carousel-section :data="advertisements" @image-click="onImageClick" />
    <q-separator size="4px" color="primary" />

    <main-content
      :style="tableStyle"
      :businessPromotion
      :directory-data="businessDirectories"
      :entityKey
      :i18nKey
    />
  </q-page>
</template>

<script setup lang="ts">
  // Types
  import type { AdvertisementView } from "@/interfaces/models/views/advertisement-view";
  import type { BusinessDirectory } from "@/interfaces/models/entities/business-directory";
  import type { BusinessPromotionView } from "@/interfaces/models/views/business-promotion-view";
  import type { BusinessVoucherView } from "@/interfaces/models/views/business-voucher-view";

  // Constants
  import { ENTITY_URL, EntityURLKey } from "@/constants";

  // Custom Components
  import MainContent from "./components/main-content.vue";

  // Props
  const { entityKey } = defineProps<{
    entityKey: EntityURLKey;
  }>();

  const { t } = useI18n({ useScope: "global" });
  const { fetchData } = useApi();
  const { openCategoryDetailDialog } = useCategoryDialogService(entityKey);
  const { getEntityName } = useUtilities();

  const advertisements = ref<AdvertisementView[]>([]);
  const businessDirectories = ref<BusinessDirectory[]>([]);
  const businessPromotion = ref<BusinessPromotionView[]>([]);
  const businessVoucher = ref<BusinessVoucherView[]>([]);
  const error = ref<string | null>(null);

  const i18nKey = getEntityName(entityKey);

  const $q = useQuasar();

  const isDialogOpen = ref(false);
  const usedHeight = computed(() => {
    const width = Math.min($q.screen.width, 1024);
    const carouselHeight = (width * 9) / 16; // Height for the carousel
    return carouselHeight + 101;
  });

  const tableStyle = computed<Record<string, any> | undefined>(() => {
    const THRESHOLD = 320 as const;
    const height = $q.screen.height - usedHeight.value;
    return height > THRESHOLD ? { height: `calc(100vh - ${usedHeight.value}px)` } : undefined;
  });

  const onImageClick = (category: AdvertisementView) => {
    openCategoryDetailDialog(isDialogOpen, category, "ADVERTISEMENT");
  };

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

  /**
   * Fetch data as part of the setup
   * This ensures that the component is compatible with Suspense
   */
  await fetchAllData();
</script>
