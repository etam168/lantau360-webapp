<template>
  <div class="row q-col-gutter-sm">
    <div v-for="item in items" :key="getItemKey(item)" class="col-md-3 col-sm-4 col-6">
      <!-- Dynamic component binding with props and event handling -->
      <component :is="getComponentType(item)" :offers="item" @click="onItemClick" />
    </div>
  </div>
</template>

<script setup lang="ts">
  import { defineAsyncComponent } from "vue";
  import { useQuasar } from "quasar";

  import { BusinessPromotion } from "@/interfaces/models/entities/business-promotion";
  import { BusinessVoucher } from "@/interfaces/models/entities/business-voucher";

  import PromotionCard from "@/components/card/promotion-card.vue";
  import VoucherCard from "@/components/card/voucher-card.vue";

  type BusinessItem = BusinessPromotion | BusinessVoucher;

  defineProps({
    items: {
      type: Array as PropType<BusinessItem[]>,
      required: true
    }
  });

  const $q = useQuasar();

  function isBusinessPromotion(item: BusinessItem): item is BusinessPromotion {
    return (item as BusinessPromotion).businessPromotionId !== undefined;
  }

  function isBusinessVoucher(item: BusinessItem): item is BusinessVoucher {
    return (item as BusinessVoucher).businessVoucherId !== undefined;
  }

  function getComponentType(item: BusinessItem) {
    if (isBusinessPromotion(item)) {
      return PromotionCard;
    } else if (isBusinessVoucher(item)) {
      return VoucherCard;
    } else {
      throw new Error("Unknown item type");
    }
  }

  function getItemKey(item: BusinessItem): number | string {
    if (isBusinessPromotion(item)) {
      return item.businessPromotionId;
    } else if (isBusinessVoucher(item)) {
      return item.businessVoucherId;
    }
    return "unknown";
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const onItemClick = (item: BusinessItem) => {
    // Assuming the dialog component can handle both promotion and voucher
    const dialogProps = isBusinessPromotion(item)
      ? { businessPromotionId: item.businessPromotionId }
      : { businessVoucherId: item.businessVoucherId };

    $q.dialog({
      component: defineAsyncComponent(
        () => import("@/components/dialog/promotion-detail-dialog.vue")
      ),
      componentProps: {
        query: dialogProps
      }
    });
  };
</script>
