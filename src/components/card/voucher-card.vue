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
  import { MarketingType } from "@/interfaces/types/marketing-types";

  const $q = useQuasar();
  const { getImageURL } = useUtilities();
  const props = defineProps({
    item: {
      type: Object as PropType<MarketingType>,
      required: true
    }
  });

  const voucherItem = computed(() => props.item as BusinessVoucherView);

  const onItemClick = (item: BusinessVoucherView) => {
    $q.dialog({
      component: defineAsyncComponent(
        () => import("@/components/dialog/marketing-detail-dialog.vue")
      ),
      componentProps: {
        query: { businessVoucherId: item.businessVoucherId }
      }
    });
  };

  const throttledHandleDialog = throttle(onItemClick, 2000);
</script>
