<template>
  <q-dialog
    ref="dialogRef"
    @hide="onDialogHide"
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
          <gallery-carousel-image
            class="col-12 q-items-center"
            :gallery-images="galleryItems"
            :address="translate(item.subtitle1, item.meta, 'subtitle1')"
          />
          <advertisement-content v-if="renderer === RENDERER.ADVERTISEMENT" :item="item" />
          <promotion-content v-else-if="renderer === RENDERER.PROMOTION" :item="item" />
          <voucher-content v-else-if="renderer === RENDERER.VOUCHER" :item="item" />
        </q-page>
      </q-page-container>
    </q-layout>
  </q-dialog>
</template>

<script setup lang="ts">
  import axios, { AxiosError } from "axios";
  import { useDialogPluginComponent } from "quasar";

  // Interface files
  import { MarketingType } from "@/interfaces/types/marketing-types";

  // .ts files
  import { URL, RENDERER } from "@/constants";
  import { useUtilities } from "@/composable/use-utilities";
  import { EventBus } from "quasar";

  // Custom Components
  import AdvertisementContent from "@/components/dialog/renderer/advertisement-content.vue";
  import VoucherContent from "@/components/dialog/renderer/voucher-content.vue";
  import PromotionContent from "@/components/dialog/renderer/promotion-content.vue";
  import { GalleryImageType } from "@/interfaces/types/gallery-image-types";

  const props = defineProps({
    item: {
      type: Object as PropType<MarketingType>,
      required: true
    }
  });

  const eventBus = new EventBus();
  const { translate } = useUtilities();
  const { dialogRef, onDialogHide } = useDialogPluginComponent();
  const isDialogVisible = ref();

  const error = ref<string | null>(null);
  const galleryItems = ref<GalleryImageType[]>([]);

  const dialogTitle = computed(() => {
    switch (true) {
      case "advertisementId" in props.item:
        return translate(props.item.advertisementName, props.item.meta, "advertisementName");
      case "businessVoucherId" in props.item:
        return translate(props.item.businessName, props.item.meta, "businessName");
      case "businessPromotionId" in props.item:
        return translate(props.item.businessName, props.item.meta, "businessName");
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
    }
  };
</script>
