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

  // .ts file
  import imageNotFound from "@/assets/img/image_not_found.jpg";
  import { CAROUSEL_BACKGROUND, BLOB_URL } from "@/constants";

  // Define type that is a union of Site and Advertisement
  type CarouselItem = SiteView | AdvertisementView;

  const props = defineProps({
    data: {
      type: Array as PropType<CarouselItem[]>,
      required: true
    },
    aspectRatio: {
      type: Number,
      required: true
    }
  });

  const $q = useQuasar();
  const slideInterval = 10000;

  // Initialize slide with the ID of the first item
  const slide = ref(props.data && props.data.length > 0 ? getId(props.data[0]) : 0);

  // Function to extract ID from the item
  function getId(item: CarouselItem): number {
    if (isAdvertisement(item)) {
      return item.advertisementId;
    } else {
      return item.siteId;
    }
  }

  // Type guard to determine if the item is an Advertisement
  function isAdvertisement(item: any): item is AdvertisementView {
    return (item as AdvertisementView).advertisementId !== undefined;
  }

  // Updated onImageClick function to handle both Site and Advertisement
  const onImageClick = (item: CarouselItem) => {
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
  function getImageSrc(row: CarouselItem) {
    return row.bannerPath ? `${BLOB_URL}/${row.bannerPath}` : imageNotFound;
  }
</script>
