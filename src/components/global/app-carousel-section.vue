<template>
  <div v-if="data && data?.length > 0">
    <q-responsive :ratio="aspectRatio()">
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
          v-for="row in data"
          :key="getId(row)"
          :name="getId(row)"
          class="q-pa-none"
          :img-src="getImageSrc(row)"
          @click="onImageClick(row)"
        >
        </q-carousel-slide>

        <!-- <template v-slot:control>
          <q-carousel-control
            position="top-left"
            :offset="[10, 10]"
            v-if="isAdvertisement(data[0])"
          >
            <q-badge color="primary" class="text-white"> Advertisement </q-badge>
          </q-carousel-control>
        </template> -->
      </q-carousel>
    </q-responsive>
  </div>
  <div v-else>
    <q-img src="@/assets/img/home-bg.webp" :ratio="aspectRatio()" />
  </div>
</template>

<script setup lang="ts">
  // Quasar Import
  import { useQuasar } from "quasar";

  // .ts file
  import imageNotFound from "@/assets/img/image_not_found.jpg";
  import { BLOB_URL } from "@/constants";
  import { Advertisement } from "@/interfaces/models/entities/advertisement";
  import { Site } from "@/interfaces/models/entities/site";

  // Define type that is a union of Site and Advertisement
  type CarouselItem = Site | Advertisement;

  const props = defineProps({
    data: {
      type: Array as PropType<CarouselItem[] | null>,
      required: false,
      default: null
    }
  });

  const $q = useQuasar();
  const { aspectRatio } = useUtilities();
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
  function isAdvertisement(item: any): item is Advertisement {
    return (item as Advertisement).advertisementId !== undefined;
  }

  // Updated onImageClick function to handle both Site and Advertisement
  const onImageClick = (item: CarouselItem) => {
    if (isAdvertisement(item)) {
      $q.dialog({
        component: defineAsyncComponent(
          () => import("@/components/dialog/marketing-detail-dialog.vue")
        ),
        componentProps: {
          item: item as Advertisement
        }
      });
    } else {
      $q.dialog({
        component: defineAsyncComponent(
          () => import("@/components/dialog/category-detail-dialog.vue")
        ),
        componentProps: {
          item: item as Site
        }
      });
    }
  };

  // getImageSrc function to handle both Site and Advertisement
  function getImageSrc(row: CarouselItem) {
    if (isAdvertisement(row)) {
      return row.bannerPath !== null && row.bannerPath !== ""
        ? `${BLOB_URL}/${row.bannerPath}`
        : imageNotFound;
    } else {
      // Return the image path for a Site or a default image
      return row.bannerPath !== null && row.bannerPath !== ""
        ? `${BLOB_URL}/${row.bannerPath}`
        : imageNotFound;
    }
  }
</script>
