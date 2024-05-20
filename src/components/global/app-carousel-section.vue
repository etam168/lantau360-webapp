<template>
  <q-responsive v-if="data && data?.length > 0" :ratio="aspectRatio">
    <q-carousel
      v-model="slide"
      animated
      control-color="white"
      swipeable
      padding
      infinite
      transition-prev="fade"
      transition-next="fade"
      transition-duration="1200"
      :autoplay="slideInterval"
    >
      <q-carousel-slide
        v-for="(row, index) in data"
        :key="index"
        :name="getId(row)"
        class="q-pa-none"
        :img-src="getImageSrc(row)"
        @click="onImageClick(row)"
      >
      </q-carousel-slide>
    </q-carousel>
  </q-responsive>
  <q-img v-else :src="CAROUSEL_BACKGROUND" :ratio="aspectRatio" />
</template>

<script setup lang="ts">
  // Quasar Import
  import { useQuasar } from "quasar";

  // Interface files
  import { AdvertisementView } from "@/interfaces/models/views/advertisement-view";
  import { SiteView } from "@/interfaces/models/views/site-view";
  import { CarouselTypes } from "@/interfaces/types/carousel-types";

  // .ts file
  import imageNotFound from "@/assets/img/image_not_found.jpg";
  import { CAROUSEL_BACKGROUND, BLOB_URL } from "@/constants";

  const props = defineProps({
    data: {
      type: Array as PropType<CarouselTypes[]>,
      required: true
    },
    aspectRatio: {
      type: Number,
      required: true
    }
  });

  const { isAdvertisement } = useUtilities();
  const $q = useQuasar();
  const slideInterval = 10000;

  // Initialize slide with the ID of the first item
  const slide = ref(props.data?.[0] ? getId(props.data[0]) : 0);

  // Function to extract ID from the item
  function getId(item: CarouselTypes): number {
    return isAdvertisement(item) ? item.advertisementId : item.siteId;
  }

  // Updated onImageClick function to handle both Site and Advertisement
  const onImageClick = (item: CarouselTypes) => {
    if (isAdvertisement(item)) {
      $q.dialog({
        component: defineAsyncComponent(
          () => import("@/components/dialog/marketing-detail-dialog.vue")
        ),
        componentProps: {
          item: item as AdvertisementView
        }
      });
    } else {
      $q.dialog({
        component: defineAsyncComponent(
          () => import("@/components/dialog/category-detail-dialog.vue")
        ),
        componentProps: {
          item: item as SiteView
        }
      });
    }
  };

  // getImageSrc function to handle both Site and Advertisement
  function getImageSrc(row: CarouselTypes) {
    return row.bannerPath ? `${BLOB_URL}/${row.bannerPath}` : imageNotFound;
  }
</script>
