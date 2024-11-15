<template>
  <div class="row q-col-gutter-sm" v-if="data.length > 0">
    <div v-for="(item, index) in sortedItems" :key="index" class="col-md-3 col-sm-4 col-6">
      <div v-if="item && 'status' in item && item.status !== 0">
        <promotion-card v-if="entityKey == 'BUSINESS_PROMOTION'" :item="item" />
        <voucher-card v-else-if="entityKey == 'BUSINESS_VOUCHER'" :item="item" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  // Interface files
  import type { CategoryTypes } from "@/interfaces/types/category-types";

  // Components
  import PromotionCard from "@/components/card/promotion-card.vue";
  import VoucherCard from "@/components/card/voucher-card.vue";

  // Constants
  import { EntityURLKey } from "@/constants";

  // Define props for this component
  const { data, entityKey } = defineProps<{
    data: CategoryTypes[];
    entityKey: EntityURLKey;
  }>();

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
