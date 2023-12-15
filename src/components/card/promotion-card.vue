<!-- eslint-disable @typescript-eslint/no-unused-vars -->
<template>
  <q-card class="my-card">
    <q-img :ratio="16 / 9" :src="computeImagePath(itemImage)" />

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

<!-- eslint-disable @typescript-eslint/no-unused-vars -->
<script setup lang="ts">
  import axios from "axios";
  import { GalleryImage } from "@/interfaces/models/entities/image-list";
  import { BusinessPromotion } from "@/interfaces/models/entities/business-promotion";
  import { BLOB_URL, BUSINESS_PROMOTION_GALLERY_URL } from "@/constants";
  import { useQuasar } from "quasar";

  type CardItem = BusinessPromotion; // Since this component is specific to BusinessPromotion

  const $q = useQuasar();
  const props = defineProps({
    item: {
      type: Object as PropType<BusinessPromotion>,
      required: true
    }
  });

  // const emit = defineEmits(["xclick"]);

  const error = ref<string | null>(null);
  const itemImage = ref<string | null>(null);

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

  onMounted(() => {
    loadData();
  });

  const loadData = async () => {
    try {
      const galleryResponse = await axios.get<GalleryImage[]>(
        `${BUSINESS_PROMOTION_GALLERY_URL}/${props.item.businessPromotionId}`
      );

      itemImage.value = galleryResponse.data.length > 0 ? galleryResponse.data[0].imagePath : null;
    } catch (err) {
      if (axios.isAxiosError(err)) {
        error.value = err.response?.status === 404 ? "Not found" : "An error occurred";
      } else {
        error.value = "An unexpected error occurred";
      }
    }
  };

  function computeImagePath(imagePath: string | null): string {
    return imagePath ? `${BLOB_URL}/${imagePath}` : "/no_image_available.jpeg";
  }
</script>
