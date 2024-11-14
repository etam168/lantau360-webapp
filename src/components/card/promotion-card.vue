<template>
  <q-card class="my-card">
    <q-img :ratio="11 / 8" :src="getImageURL(item.bannerPath)" />

    <q-card-section>
      <q-item dense class="q-pa-none">
        <q-item-section>
          <q-item-label>{{ translatedTitle }}</q-item-label>
        </q-item-section>
      </q-item>
    </q-card-section>

    <q-card-actions>
      <q-btn
        outline
        dense
        color="primary"
        :label="$t(`${i18nKey}.moreDetail`)"
        class="full-width"
        @click="onItemClick(promotionItem)"
      />
    </q-card-actions>
  </q-card>
</template>

<script setup lang="ts">
  // Interface files
  import type { BusinessPromotionView } from "@/interfaces/models/views/business-promotion-view";
  import type { CategoryTypes } from "@/interfaces/types/category-types";

  // Constants
  import { EntityURLKey } from "@/constants";

  // Props
  const { item } = defineProps<{ item: CategoryTypes }>();

  const i18nKey = "business";
  const entityKey: EntityURLKey = "BUSINESS_PROMOTION";

  const { eventBus, getImageURL, translate } = useUtilities();
  const { openCategoryDetailDialog } = useCategoryDialogService(entityKey);

  const promotionItem = computed(() => item as BusinessPromotionView);

  const translatedTitle: any = ref(
    translate(
      promotionItem.value.businessPromotionName,
      promotionItem.value.meta,
      "businessPromotionName"
    )
  );

  const onItemClick = (item: BusinessPromotionView) => {
    const dialogName = "BusinessPromotionDetail";
    eventBus("DialogStatus").emit(true, dialogName);
    openCategoryDetailDialog(item, dialogName);
  };
</script>
