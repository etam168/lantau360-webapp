<template>
  <div class="row">
    <div v-for="item in offers" :key="item.businessVoucherId" class="col-md-3 col-6 q-pa-sm">
      <voucher-card :offers="item" @on-click="onItemClick" />
    </div>
  </div>
</template>
<script setup lang="ts">
  // Vue Import
  import { PropType, defineAsyncComponent } from "vue";

  //Custom Components
  import VoucherCard from "./components/voucher-card.vue";

  const $q = useQuasar();

  // .ts file
  import { BusinessVoucher } from "@/interfaces/models/entities/businessVoucher";
  import { useQuasar } from "quasar";
  defineProps({
    offers: {
      type: Object as PropType<BusinessVoucher[]>,
      required: true
    }
  });

  const onItemClick = (item: BusinessVoucher) => {
    $q.dialog({
      component: defineAsyncComponent(() => import("./dialog/voucher-detail-dialog.vue")),
      componentProps: {
        query: { businessVoucherId: item.businessVoucherId }
      }
    });
  };
</script>
