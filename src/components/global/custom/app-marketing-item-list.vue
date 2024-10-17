<template>
  <div class="row q-col-gutter-sm" v-if="data.length > 0">
    <div v-for="(item, index) in sortedItems" :key="index" class="col-md-3 col-sm-4 col-6">
      <div v-if="item.status !== 0">
        <promotion-card v-if="isBusinessPromotion(item)" :item="item" />
        <voucher-card v-else-if="isBusinessVoucher(item)" :item="item" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  // Interface files
  import { MarketingType } from "@/interfaces/types/marketing-types";

  // Custom Components
  import PromotionCard from "@/components/card/promotion-card.vue";
  import VoucherCard from "@/components/card/voucher-card.vue";

  // Define props for this component
  const { data } = defineProps<{
    data: MarketingType[];
  }>();

  const { isBusinessPromotion, isBusinessVoucher } = useUtilities();

  //Computed property to transform items into key/value pairs
  const sortedItems = computed(() => {
    const temp = [...data];
    return temp.sort((a: any, b: any) => {
      const idA = a.businessPromotionId !== undefined ? a.businessPromotionId : a.businessVoucherId;
      const idB = b.businessPromotionId !== undefined ? b.businessPromotionId : b.businessVoucherId;
      return a.rank - b.rank || idA - idB;
    });
  });
</script>
