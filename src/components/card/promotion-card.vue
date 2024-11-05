<template>
  <q-card class="my-card">
    <q-img :ratio="11 / 8" :src="getImageURL(item.bannerPath)" />

    <q-card-section>
      <q-item dense class="q-pa-none">
        <q-item-section>
          <q-item-label>{{ translatedTitle }}</q-item-label>
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

  const { eventBus } = useUtilities();
  const $q = useQuasar();
  const { translate, getImageURL } = useUtilities();
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
    eventBus("DialogStatus").emit(true, "BusinessPromotionDetail");
    $q.dialog({
      component: defineAsyncComponent(
        () => import("@/components/dialog/category-detail-dialog/index.vue")
      ),
      componentProps: {
        category: item,
        entityKey: "BUSINESS_PROMOTION",
        dialogName: "BusinessPromotionDetail"
      }
    });
  };

  const throttledHandleDialog = throttle(onItemClick, 2000);
</script>
