<template>
  <q-dialog
    ref="dialogRef"
    transition-show="slide-up"
    transition-hide="slide-down"
    @update:model-value="updateDialogState"
    :model-value="isDialogVisible"
    maximized
  >
    <q-layout view="lHh lpr lFf" class="bg-white" style="max-width: 1024px">
      <q-header class="bg-transparent text-dark">
        <app-dialog-title>{{ dialogTitle }}</app-dialog-title>
      </q-header>

      <q-page-container>
        <q-page>
          <div v-if="galleryItems && galleryItems?.length > 0">
            <gallery-image-list :image-list="galleryItems" />
          </div>
          <div v-else>
            <q-responsive :ratio="16 / 9">
              <q-img :src="IMAGES.NO_IMAGE_AVAILABLE_PLACEHOLDER" />
            </q-responsive>
          </div>
          <advertisement-renderer v-if="renderer === RENDERER.ADVERTISEMENT" :item="item" />
          <promotion-renderer v-else-if="renderer === RENDERER.PROMOTION" :item="item" />
          <voucher-renderer v-else-if="renderer === RENDERER.VOUCHER" :item="item" />
        </q-page>
      </q-page-container>
    </q-layout>
  </q-dialog>
</template>

<script setup lang="ts">
  import { useDialogPluginComponent } from "quasar";

  // Interface files
  import { GalleryImageType } from "@/interfaces/types/gallery-image-types";
  import { MarketingType } from "@/interfaces/types/marketing-types";

  // .ts files
  import { URL, RENDERER, IMAGES } from "@/constants";
  import { useUtilities } from "@/composable/use-utilities";

  // Custom Components
  import AdvertisementRenderer from "@/components/dialog/renderer/advertisement-renderer.vue";
  import VoucherRenderer from "@/components/dialog/renderer/voucher-renderer.vue";
  import PromotionRenderer from "@/components/dialog/renderer/promotion-renderer.vue";

  const props = defineProps({
    item: {
      type: Object as PropType<MarketingType>,
      required: true
    }
  });

  const { translate, eventBus } = useUtilities();
  const { dialogRef } = useDialogPluginComponent();
  const isDialogVisible = ref();
  const { t } = useI18n({ useScope: "global" });

  const error = ref<string | null>(null);
  const galleryItems = ref<GalleryImageType[]>([]);

  const dialogTitle = computed(() => {
    switch (true) {
      case "advertisementId" in props.item:
        return translate(props.item.advertisementName, props.item.meta, "advertisementName");
      case "businessVoucherId" in props.item:
        return translate(props.item.businessName, props.item.meta, "businessName");
      case "businessPromotionId" in props.item:
        return translate(
          props.item.businessPromotionName,
          props.item.meta,
          "businessPromotionName"
        );
      default:
        return "";
    }
  });

  const galleryUrl = computed(() => {
    switch (true) {
      case "advertisementId" in props.item:
        return `${URL.ADVERTISEMENT_GALLERY}/${props.item.advertisementId}`;
      case "businessVoucherId" in props.item:
        return `${URL.BUSINESS_VOUCHER_GALLERY_URL}/${props.item.businessVoucherId}`;
      case "businessPromotionId" in props.item:
        return `${URL.BUSINESS_PROMOTION_GALLERY_URL}/${props.item?.businessPromotionId}`;
      default:
        return "";
    }
  });

  const renderer = computed(() => {
    switch (true) {
      case "advertisementId" in props.item:
        return RENDERER.ADVERTISEMENT;
      case "businessVoucherId" in props.item:
        return RENDERER.VOUCHER;
      case "businessPromotionId" in props.item:
        return RENDERER.PROMOTION;
      default:
        return "";
    }
  });

  onMounted(() => {
    loadData();
    eventBus.on("CategoryDetailDialog", () => {
      isDialogVisible.value = false;
    });
  });

  function updateDialogState(status: any) {
    isDialogVisible.value = status;
    eventBus.emit("DialogStatus", status, "CategoryDetailDialog");
  }

  const loadData = async () => {
    if (galleryUrl.value) {
      try {
        const [galleryResponse] = await Promise.all([axios.get(galleryUrl.value)]);

        galleryItems.value = galleryResponse.data;

        let maskValue = 0; // Default maskValue for advertisement

        if ("businessVoucherId" in props.item) {
          maskValue = 0; // Set maskValue to 2 for businessVoucher
        } else if ("businessPromotionId" in props.item) {
          maskValue = 1; // Set maskValue to 3 for businessPromotion
        } else if ("advertisementId" in props.item) {
          maskValue = 0; // Set maskValue to 3 for businessPromotion
        }

        galleryItems.value = galleryItems.value
          .filter(element => !((maskValue >> (element.ranking - 1)) & 1))
          .sort((a, b) => a.ranking - b.ranking);
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
  };
</script>
