<template>
  <q-card class="my-card">
    <q-img :ratio="1" :src="getImageURL(item.bannerPath)" />

    <q-card-actions>
      <q-space />
      <q-btn
        outline
        dense
        color="primary"
        :label="$t(`${i18nKey}.moreDetail`)"
        class="full-width"
        @click="throttledHandleDialog(voucherItem)"
      />
    </q-card-actions>
  </q-card>
</template>

<script setup lang="ts">
  // Quasar Import
  import { throttle, useQuasar } from "quasar";

  // Interface file
  import type { BusinessVoucherView } from "@/interfaces/models/views/business-voucher-view";
  import type { CategoryTypes } from "@/interfaces/types/category-types";

  // Props
  const { item } = defineProps<{ item: CategoryTypes }>();

  const i18nKey = "business";

  const $q = useQuasar();
  const { getImageURL } = useUtilities();

  const voucherItem = computed(() => item as BusinessVoucherView);

  const onItemClick = (item: BusinessVoucherView) => {
    $q.dialog({
      component: defineAsyncComponent(
        () => import("@/components/dialog/category-detail-dialog/index.vue")
      ),
      componentProps: {
        category: item,
        entityKey: "BUSINESS_VOUCHER"
      }
    });
  };

  const throttledHandleDialog = throttle(onItemClick, 2000);
</script>
