<template>
  <q-card class="my-card">
    <q-img :ratio="1" :src="getImageURL(item.bannerPath)" />

    <q-card-actions>
      <q-btn
        outline
        dense
        color="primary"
        :label="$t(`${i18nKey}.moreDetail`)"
        class="full-width"
        @click="onItemClick(voucherItem)"
      />
    </q-card-actions>
  </q-card>
</template>

<script setup lang="ts">
  // Interface file
  import type { BusinessVoucherView } from "@/interfaces/models/views/business-voucher-view";
  import type { CategoryTypes } from "@/interfaces/types/category-types";

  // Constants
  import { EntityURLKey } from "@/constants";

  // Props
  const { item } = defineProps<{ item: CategoryTypes }>();

  const i18nKey = "business";
  const entityKey: EntityURLKey = "BUSINESS_VOUCHER";

  const { eventBus, getImageURL } = useUtilities();
  const { openCategoryDetailDialog } = useCategoryDialogService(entityKey);

  const voucherItem = computed(() => item as BusinessVoucherView);

  const onItemClick = (item: BusinessVoucherView) => {
    const dialogName = "BusinessVoucherDetail";
    eventBus("DialogStatus").emit(true, dialogName);
    openCategoryDetailDialog(item, dialogName);
  };
</script>
