<template>
  <q-responsive v-if="data && data?.length > 0" :ratio="computedRatio">
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
      <!-- :name="getId(row)" -->
      <q-carousel-slide
        v-for="(row, index) in data"
        :key="index"
        :name="index"
        class="q-pa-none"
        :img-src="getImageURL(row.bannerPath)"
        @click="$emit('image-click', row)"
      >
      </q-carousel-slide>
    </q-carousel>
  </q-responsive>
  <q-img v-else :src="IMAGES.CAROUSEL_BACKGROUND" :ratio="computedRatio" />
</template>

<script setup lang="ts">
  // Types
  import type { CarouselTypes } from "@/interfaces/types/carousel-types";

  // Constants
  import { IMAGES } from "@/constants";

  // Emits
  const emit = defineEmits(["image-click"]);

  // Props
  const { data, ratio } = defineProps<{
    data: CarouselTypes[];
    ratio?: number;
  }>();

  const { aspectRatio, getImageURL } = useUtilities();

  // Computed property for ratio
  const computedRatio = computed(() => ratio ?? aspectRatio());

  // Initialize slide with the ID of the first item
  const slideInterval = 10000;
  //const slide = ref(data?.[0] ? getId(data[0]) : 0);
  const slide = ref(0);

  // Function to extract ID from the item
  // function getId(item: CarouselTypes): number {
  //   return isAdvertisement(item) ? item.advertisementId : item.siteId;
  // }
</script>
