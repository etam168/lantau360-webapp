<!-- eslint-disable @typescript-eslint/no-unused-vars -->
<template>
  <q-card class="my-card">
    <q-img :ratio="16 / 9" :src="computeImagePath(item.bannerPath)" />

    <q-card-section class="q-pa-sm">
      <q-item dense class="q-py-none">
        <q-item-section thumbnail class="q-pr-sm">
          <q-icon color="green" name="location_on" size="xs" />
        </q-item-section>

        <q-item-section>
          <q-item-label style="font-family: Baloo; font-size: 1rem">{{
            item?.subtitle1
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
        @click="onItemClick"
      />
    </q-card-actions>
  </q-card>
</template>

<script setup lang="ts">
  import { BusinessPromotion } from "@/interfaces/models/entities/business-promotion";
  import { BLOB_URL } from "@/constants";
  import { useQuasar } from "quasar";

  const $q = useQuasar();
  const props = defineProps({
    item: {
      type: Object as PropType<BusinessPromotion>,
      required: true
    }
  });

  // const emit = defineEmits(["xclick"]);
  const onItemClick = () => {
    $q.dialog({
      component: defineAsyncComponent(
        () => import("@/components/dialog/promotion-detail-dialog.vue")
      ),
      componentProps: {
        query: { businessPromotionId: props.item.businessPromotionId }
      }
    });
  };

  function computeImagePath(imagePath: string | null): string {
    return imagePath ? `${BLOB_URL}/${imagePath}` : "/no_image_available.jpeg";
  }
</script>
