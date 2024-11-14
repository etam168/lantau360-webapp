<template>
  <q-card class="my-card">
    <q-img :ratio="1" :src="getImageURL(item.bannerPath)" />

    <q-card-actions>
      <q-space />
      <q-btn
        outline
        dense
        color="primary"
        :label="$t('business.moreDetail')"
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
  import { BusinessVoucherView } from "@/interfaces/models/views/business-voucher-view";
  import { CategoryTypes } from "@/interfaces/types/category-types";

  const $q = useQuasar();
  const { getImageURL } = useUtilities();

  const { item } = defineProps<{ item: CategoryTypes }>();

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
