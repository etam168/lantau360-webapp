<template>
  <q-card class="my-card">
    <q-img :ratio="16 / 9" :src="computeImagePath(itemImage)" />
    <q-card-section class="q-pa-sm">
      <app-item dense icon="location_on" :label="offers?.businessName" />
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

<script setup lang="ts">
  // Vue Import
  import axios, { AxiosError } from "axios";
  import { GalleryImage } from "@/interfaces/models/entities/image-list";
  import { PropType, onMounted, ref } from "vue";
  import { BusinessPromotion } from "@/interfaces/models/entities/businessPromotion";
  import { BusinessVoucher } from "@/interfaces/models/entities/businessVoucher";

  import { BLOB_URL, BUSINESS_VOUCHER_GALLERY_URL } from "@/constants";

  import AppItem from "@/components/widgets/app-item.vue";

  type BusinessItem = BusinessPromotion | BusinessVoucher;

  const props = defineProps({
    offers: {
      type: Object as PropType<BusinessItem>,
      required: true
    }
  });

  // const emit = defineEmits(["click"]);

  const error = ref<string | null>(null);
  const itemImage = ref();

  function onItemClick() {
    emit("click", props.offers);
  }

  onMounted(() => {
    loadData();
  });

  const loadData = async () => {
    try {
      const [galleryResponse] = await Promise.all([
        axios.get<GalleryImage[]>(
          `${BUSINESS_VOUCHER_GALLERY_URL}/${props?.offers?.businessVoucherId}`
        )
      ]);

      itemImage.value = galleryResponse.data[0].imagePath;
    } catch (err) {
      if (err instanceof AxiosError) {
        if (err.response && err.response.status === 404) {
          error.value = "Not found";
        } else {
          error.value = "An error occurred";
        }
      } else {
        error.value = "An unexpected error occurred";
      }
    }
  };

  function computeImagePath(imagePath: any) {
    return imagePath ? `${BLOB_URL}/${imagePath}` : "/no_image_available.jpeg";
  }
</script>
