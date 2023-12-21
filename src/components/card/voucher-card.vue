<template>
  <q-card class="my-card">
    <q-img :ratio="1" :src="imagePath" />
    <q-card-section class="q-pa-sm">
      <!-- <app-item dense icon="location_on" :label="offers?.businessName" /> -->
    </q-card-section>

    <q-card-actions>
      <q-space />
      <q-btn
        outline
        dense
        color="primary"
        label="More Details"
        class="full-width"
        @click="onItemClick(voucherItem)"
      />
    </q-card-actions>
  </q-card>
</template>

<script setup lang="ts">
  import { MarketingType } from "@/interfaces/types/marketing-types";
  import { BusinessVoucher } from "@/interfaces/models/entities/business-voucher";
  import { BLOB_URL } from "@/constants";
  import { useQuasar } from "quasar";

  const $q = useQuasar();

  const props = defineProps({
    item: {
      type: Object as PropType<MarketingType>,
      required: true
    }
  });

  const voucherItem = computed(() => props.item as BusinessVoucher);

  const onItemClick = (item: BusinessVoucher) => {
    $q.dialog({
      component: defineAsyncComponent(
        () => import("@/components/dialog/marketing-detail-dialog.vue")
      ),
      componentProps: {
        query: { businessVoucherId: item.businessVoucherId }
      }
    });
  };

  const imagePath = computed(() => {
    return props.item.bannerPath
      ? `${BLOB_URL}/${props.item.bannerPath}`
      : "/no_image_available.jpeg";
  });
</script>
