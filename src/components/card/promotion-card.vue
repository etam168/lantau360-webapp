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
        :label="$t(`${i18nKey}.moreDetail`)"
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
  import type { BusinessPromotionView } from "@/interfaces/models/views/business-promotion-view";
  import type { CategoryTypes } from "@/interfaces/types/category-types";

  // Props
  const { item } = defineProps<{ item: CategoryTypes }>();

  const i18nKey = "business";

  const $q = useQuasar();
  const { eventBus, getImageURL, translate } = useUtilities();

  const promotionItem = computed(() => item as BusinessPromotionView);

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
