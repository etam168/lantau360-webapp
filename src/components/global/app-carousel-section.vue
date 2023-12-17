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
        class="bg-primary"
      >
        <q-carousel-slide
          v-for="row in data"
          :key="getId(row)"
          :name="getId(row)"
          class="q-pa-none"
          :img-src="getImageSrc(row)"
          @click="onImageClick(row)"
        >
          <!-- <q-tooltip anchor="top middle" self="bottom middle" :offset="[10, 10]">
            <strong>Advertisement Id:</strong> {{ row.advertisementId }}
          </q-tooltip> -->
        </q-carousel-slide>

        <template v-slot:control>
          <q-carousel-control position="top-left" :offset="[10, 10]">
            <q-badge color="primary" class="text-white"> Sponsored </q-badge>
          </q-carousel-control>
        </template>
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
  import { BLOB_URL } from "@/constants";
  import imageNotFound from "@/assets/img/image_not_found.jpg";
  import { Advertisement } from "@/interfaces/models/entities/advertisement";
  import { Site } from "@/interfaces/models/entities/site";

  // Define a new type that is a union of Site and Advertisement
  type DataItem = Site | Advertisement;

  const props = defineProps({
    data: {
      type: Array as PropType<DataItem[] | null>,
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
  function getId(item: DataItem): number {
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
  const onImageClick = (item: DataItem) => {
    if (isAdvertisement(item)) {
      $q.dialog({
        component: defineAsyncComponent(
          () => import("@/components/dialog/advertisement-dialog.vue")
        ),
        componentProps: {
          query: { advertisementId: item.advertisementId }
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
  function getImageSrc(row: DataItem) {
    if (isAdvertisement(row)) {
      return row.imagePath !== null && row.imagePath !== ""
        ? `${BLOB_URL}/${row.imagePath}`
        : imageNotFound;
    } else {
      // Return the image path for a Site or a default image
      return row.bannerPath !== null && row.bannerPath !== ""
        ? `${BLOB_URL}/${row.bannerPath}`
        : imageNotFound;
    }
  }
</script>