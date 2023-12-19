<template>
  <div class="row q-col-gutter-sm">
    <div v-for="item in items" :key="getItemKey(item)" class="col-md-3 col-sm-4 col-6">
      <!-- Dynamic component binding with conditional props -->
      <component :is="getComponentType(item)" v-bind="getComponentProps(item)" />
    </div>
  </div>
</template>

<script setup lang="ts">
  // ts files
  import { BusinessPromotion } from "@/interfaces/models/entities/business-promotion";
  import { BusinessVoucher } from "@/interfaces/models/entities/business-voucher";
  import { CommunityEvent } from "@/interfaces/models/entities/community-event";

  // Custom Components
  import EventCard from "@/components/card/event-card.vue";
  import PromotionCard from "@/components/card/promotion-card.vue";
  import VoucherCard from "@/components/card/voucher-card.vue";

  type CardItem = BusinessPromotion | BusinessVoucher | CommunityEvent;

  // Define props for this component
  defineProps({
    items: {
      type: Array as PropType<CardItem[]>,
      required: true
    }
  });

  function getItemType(item: CardItem): "promotion" | "voucher" | "event" {
    if ("businessPromotionId" in item) return "promotion";
    if ("businessVoucherId" in item) return "voucher";
    if ("communityEventId" in item) return "event";
    throw new Error("Unknown item type");
  }

  function getComponentType(item: CardItem) {
    switch (getItemType(item)) {
      case "promotion":
        return PromotionCard;
      case "voucher":
        return VoucherCard;
      case "event":
        return EventCard;
      default:
        throw new Error("Unknown item type");
    }
  }

  function getItemKey(item: CardItem): number {
    switch (getItemType(item)) {
      case "promotion":
        return (item as BusinessPromotion).businessPromotionId;
      case "voucher":
        return (item as BusinessVoucher).businessVoucherId;
      case "event":
        return (item as CommunityEvent).communityEventId;
      default:
        return -1;
    }
  }

  function getComponentProps(item: CardItem) {
    if ("businessPromotionId" in item) {
      return { item: item as BusinessPromotion };
    } else if ("businessVoucherId" in item) {
      return { item: item as BusinessVoucher };
    } else if ("communityEventId" in item) {
      return { item: item as CommunityEvent };
    }
    throw new Error("Unknown item type");
  }
</script>
