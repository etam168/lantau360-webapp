<template>
  <div class="row q-col-gutter-sm">
    <div v-for="(item, index) in itemsWithType" :key="index" class="col-md-3 col-sm-4 col-6">
      <promotion-card v-if="item.type === PROMOTION.PROMOTION" :item="item.value" />
      <voucher-card v-else-if="item.type === PROMOTION.VOUCHER" :item="item.value" />
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
  const props = defineProps({
    items: {
      type: Array as PropType<MarketingType[]>,
      required: true
    }
  });

  const PROMOTION = {
    PROMOTION: "Promotion",
    VOUCHER: "Voucher"
  };

  function getItemType(item: MarketingType) {
    switch (true) {
      case "businessPromotionId" in item:
        return PROMOTION.PROMOTION;
      case "businessVoucherId" in item:
        return PROMOTION.VOUCHER;
      default:
        return "";
    }
  }

  // Computed property to transform items into key/value pairs
  const itemsWithType = computed(() => {
    return props.items.map(item => ({
      value: item,
      type: getItemType(item)
    }));
  });
</script>
