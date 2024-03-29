<template>
  <q-card class="my-card">
    <q-img :ratio="11 / 8" :src="imagePath" />

    <q-card-section class="q-pa-sm">
      <q-item dense class="q-py-none">
        <q-item-section>
          <q-item-label style="font-family: Baloo; font-size: 1rem">{{
            translatedTitle
          }}</q-item-label>
        </q-item-section>
      </q-item>
    </q-card-section>

    <q-card-actions>
      <q-space />
      <q-btn
        outline
        dense
        color="primary"
        :label="$t('business.moreDetail')"
        class="full-width"
        @click="throttledHandleDialog(promotionItem)"
      />
    </q-card-actions>
  </q-card>
</template>

<script setup lang="ts">
  // Quasar Import
  import { throttle, useQuasar } from "quasar";

  // Interface files
  import { BusinessPromotionView } from "@/interfaces/models/views/business-promotion-view";
  import { MarketingType } from "@/interfaces/types/marketing-types";

  // .ts files
  import { BLOB_URL } from "@/constants";

  const $q = useQuasar();
  const { translate } = useUtilities();
  const props = defineProps({
    item: {
      type: Object as PropType<MarketingType>,
      required: true
    }
  });

  const promotionItem = computed(() => props.item as BusinessPromotionView);

  const translatedTitle: any = ref(
    translate(
      promotionItem.value.businessPromotionName,
      promotionItem.value.meta,
      "businessPromotionName"
    )
  );

  const onItemClick = (item: BusinessPromotionView) => {
    $q.dialog({
      component: defineAsyncComponent(
        () => import("@/components/dialog/marketing-detail-dialog.vue")
      ),
      componentProps: {
        item: item
      }
    });
  };

  const imagePath = computed(() => {
    return props.item.bannerPath
      ? `${BLOB_URL}/${props.item.bannerPath}`
      : "./img/icons/no_image_available.jpeg";
  });

  const throttledHandleDialog = throttle(onItemClick, 2000);
</script>
