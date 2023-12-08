<template>
  <q-card class="my-card">
    <q-img :ratio="16 / 9" :src="computeImagePath(itemImage)" />

    <q-card-section class="q-pa-sm">
      <app-item dense icon="location_on" :label="offers?.subtitle1" />
      <app-item dense icon="schedule" :label="computeBusinessHours(offers)" />
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
  import { date } from "quasar";

  import { BLOB_URL, BUSINESS_PROMOTION_GALLERY_URL } from "@/constants";

  import AppItem from "@/components/widgets/app-item.vue";

  const props = defineProps({
    offers: {
      type: Object as PropType<BusinessPromotion>,
      required: true
    }
  });

  const emit = defineEmits(["on-click"]);

  const error = ref<string | null>(null);
  const itemImage = ref();

  const computeBusinessHours = (row: BusinessPromotion) => {
    const datePart = date.formatDate(Date.now(), "YYYY-MM-DDT");

    // Check if openTime and closeTime are undefined or null, provide default values
    const openTime = row.openTime
      ? Date.parse(datePart + row.openTime)
      : Date.parse(datePart + "09:00");
    const closeTime = row.closeTime
      ? Date.parse(datePart + row.closeTime)
      : Date.parse(datePart + "17:00");

    return `${date.formatDate(openTime, "HH:mm")} - ${date.formatDate(closeTime, "HH:mm")}`;
  };

  function onItemClick() {
    alert(JSON.stringify(props.offers));
    emit("on-click", props.offers);
  }

  onMounted(() => {
    loadData();
  });

  const loadData = async () => {
    try {
      const [galleryResponse] = await Promise.all([
        axios.get<GalleryImage[]>(
          `${BUSINESS_PROMOTION_GALLERY_URL}/${props?.offers?.businessPromotionId}`
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
