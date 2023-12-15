<template>
  <q-card class="my-card">
    <q-img :ratio="16 / 9" :src="computeImagePath(itemImage)" />
    <q-card-section class="q-pa-sm">
      <!-- <app-item dense icon="location_on" :label="offers?.businessName" /> -->
    </q-card-section>

    <q-card-actions>
      <q-space />
      <q-btn
        outline
        dense
        color="primary"
        label="More Details"
        class="full-width"
        @click="onItemClick()"
      />
    </q-card-actions>
  </q-card>
</template>

<!-- eslint-disable @typescript-eslint/no-unused-vars -->
<script setup lang="ts">
  import axios from "axios";
  import { GalleryImage } from "@/interfaces/models/entities/image-list";
  import { BusinessVoucher } from "@/interfaces/models/entities/business-voucher";
  import { BLOB_URL, BUSINESS_VOUCHER_GALLERY_URL } from "@/constants";
  import { useQuasar } from "quasar";

  // Assuming AppItem is a component you would use for displaying certain item properties
  // import AppItem from "@/components/widgets/app-item.vue";
  const $q = useQuasar();

  const props = defineProps({
    item: {
      type: Object as PropType<BusinessVoucher>,
      required: true
    }
  });

  // const emit = defineEmits(["xclick"]);

  const error = ref<string | null>(null);
  const itemImage = ref<string | null>(null);

  const onItemClick = () => {
    $q.dialog({
      component: defineAsyncComponent(
        () => import("@/components/dialog/voucher-detail-dialog.vue")
      ),
      componentProps: {
        query: { businessVoucherId: props.item.businessVoucherId }
      }
    });
  };

  onMounted(() => {
    loadData();
  });

  const loadData = async () => {
    try {
      const galleryResponse = await axios.get<GalleryImage[]>(
        `${BUSINESS_VOUCHER_GALLERY_URL}/${props.item.businessVoucherId}`
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
