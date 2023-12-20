<template>
  <q-card class="my-card">
    <q-img :ratio="1" :src="imagePath" />

    <q-card-section class="q-pa-sm">
      <q-item dense class="q-py-none">
        <q-item-section thumbnail class="q-pr-sm">
          <q-icon color="green" name="location_on" size="xs" />
        </q-item-section>

        <q-item-section>
          <q-item-label style="font-family: Baloo; font-size: 1rem">{{
            promotionItem?.subtitle1
          }}</q-item-label>
        </q-item-section>
      </q-item>
    </q-card-section>

    <q-card-actions>
      <q-space />
      <q-btn
        outline
        dense
        color="primary"
        label="More Details"
        class="full-width"
        @click="onItemClick(promotionItem)"
      />
    </q-card-actions>
  </q-card>
</template>

<script setup lang="ts">
  import { BLOB_URL } from "@/constants";
  import { useQuasar } from "quasar";
  import { PromotionType } from "@/interfaces/types/promotion-types";
  import { BusinessPromotion } from "@/interfaces/models/entities/business-promotion";

  const $q = useQuasar();
  const props = defineProps({
    item: {
      type: Object as PropType<PromotionType>,
      required: true
    }
  });

  const promotionItem = computed(() => props.item as BusinessPromotion);

  const onItemClick = (item: BusinessPromotion) => {
    $q.dialog({
      component: defineAsyncComponent(
        () => import("@/components/dialog/promotion-detail-dialog.vue")
      ),
      componentProps: {
        query: { businessPromotionId: item.businessPromotionId }
      }
    });
  };

  const imagePath = computed(() => {
    return props.item.bannerPath
      ? `${BLOB_URL}/${props.item.bannerPath}`
      : "/no_image_available.jpeg";
  });
</script>
