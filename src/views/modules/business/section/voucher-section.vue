<template>
  <div class="row">
    <div v-for="item in offers.slice(0, 8)" :key="item.businessId" class="col-md-3 col-6 q-pa-sm">
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
  import { Business } from "@/interfaces/models/entities/business";
  import { useQuasar } from "quasar";
  defineProps({
    offers: {
      type: Object as PropType<Business[]>,
      required: true
    }
  });

  const onItemClick = (item: any) => {
    $q.dialog({
      component: defineAsyncComponent(() => import("./dialog/voucher-detail-dialog.vue")),
      componentProps: {
        query: { businessId: item.businessId }
      }
    });
  };
</script>
