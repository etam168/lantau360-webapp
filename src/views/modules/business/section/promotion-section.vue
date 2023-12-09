<template>
  <div class="row">
    <div v-for="item in offers" :key="item.businessPromotionId" class="col-md-3 col-6 q-pa-sm">
      <promotion-card :offers="item" @on-click="onItemClick" />
    </div>
  </div>
</template>
<script setup lang="ts">
  // Vue Import
  import { PropType, defineAsyncComponent } from "vue";

  //Custom Components
  import PromotionCard from "./components/promotion-card.vue";

  // .ts file
  import { BusinessPromotion } from "@/interfaces/models/entities/businessPromotion";
  import { useQuasar } from "quasar";
  defineProps({
    offers: {
      type: Object as PropType<BusinessPromotion[]>,
      required: true
    }
  });

  const $q = useQuasar();

  const onItemClick = (item: BusinessPromotion) => {
    $q.dialog({
      component: defineAsyncComponent(() => import("./dialog/promotion-detail-dialog.vue")),
      componentProps: {
        query: { businessPromotionId: item.businessPromotionId }
      }
    });
  };
</script>
