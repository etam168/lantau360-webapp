<template>
  <q-responsive v-if="data && data?.length > 0" :ratio="ratio">
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
        :img-src="getImageURL(row.bannerPath)"
        @click="$emit('image-click', row)"
      >
        <!-- @click="onImageClick(row)" -->
      </q-carousel-slide>
    </q-carousel>
  </q-responsive>
  <q-img v-else :src="IMAGES.CAROUSEL_BACKGROUND" :ratio="aspectRatio" />
</template>

<script setup lang="ts">
  // Types
  import type { CarouselTypes } from "@/interfaces/types/carousel-types";

  // Constants
  import { IMAGES } from "@/constants";

  const { aspectRatio, getImageURL, isAdvertisement } = useUtilities();

  // Emits
  const emit = defineEmits(["image-click"]);

  // Props
  const { data, ratio = aspectRatio() } = defineProps<{
    data: CarouselTypes[];
    ratio?: number;
  }>();

  const slideInterval = 10000;

  // Initialize slide with the ID of the first item
  const slide = ref(data?.[0] ? getId(data[0]) : 0);

  // Function to extract ID from the item
  function getId(item: CarouselTypes): number {
    return isAdvertisement(item) ? item.advertisementId : item.siteId;
  }

  // // Updated onImageClick function to handle both Site and Advertisement
  // const onImageClick = (item: CarouselTypes) => {
  //   if (isAdvertisement(item)) {
  //     $q.dialog({
  //       component: defineAsyncComponent(
  //         () => import("@/components/dialog/marketing-detail-dialog.vue")
  //       ),
  //       componentProps: {
  //         item: item as AdvertisementView
  //       }
  //     });
  //   } else {
  //     $q.dialog({
  //       component: defineAsyncComponent(
  //         () => import("@/components/dialog/category-detail-dialog.vue")
  //       ),
  //       componentProps: {
  //         item: item as SiteView
  //       }
  //     });
  //   }
  // };
</script>
