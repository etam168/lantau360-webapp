<template>
  <div v-if="galleryItems && galleryItems?.length > 0">
    <q-card bordered flat>
      <q-responsive :ratio="16 / 9">
        <q-carousel v-model="slide" animated arrows class="bg-thumbnail">
          <q-carousel-slide
            v-for="(image, index) in galleryItems"
            :key="index"
            :name="image.imageId"
            :img-src="getImageSrc(image.imagePath)"
          >
          </q-carousel-slide>
        </q-carousel>
      </q-responsive>
    </q-card>

    <q-card flat>
      <q-card-section horizontal class="q-py-none">
        <q-btn
          size="lg"
          square
          padding="none"
          icon="chevron_left"
          @click="scrollLeft"
          color="grey-9"
          text-color="white"
        />

        <q-virtual-scroll
          ref="virtualScroll"
          class="bg-grey-4 full-width justify-center"
          :items="galleryItems"
          :virtual-scroll-item-size="84"
          virtual-scroll-horizontal
          @virtual-scroll="onVirtualScroll"
          v-slot="{ item: row }"
        >
          <div class="q-pa-none" style="width: 84px">
            <property-thumbnail-image :rowData="row" @on-image="showImage(row)" />
          </div>
        </q-virtual-scroll>

        <q-btn
          size="lg"
          square
          padding="none"
          icon="chevron_right"
          @click="scrollRight"
          color="grey-9"
          text-color="white"
        />
      </q-card-section>
    </q-card>
  </div>
  <div v-else>
    <q-img :src="PLACEHOLDER_THUMBNAIL" :ratio="3 / 1" style="height: 380px" />
  </div>
</template>

<script setup lang="ts">
  // Vue Import
  import { PropType, ref, watch } from "vue";

  // .ts file
  import { BLOB_URL, PLACEHOLDER_THUMBNAIL } from "@/constants";

  // Custom Components
  import PropertyThumbnailImage from "./property-thumbnail-image.vue";
  import { GalleryImage } from "@/interfaces/models/entities/image-list";

  const props = defineProps({
    galleryImages: {
      type: Object as PropType<GalleryImage[]>,
      required: true
    }
  });

  // const slide = ref(0);
  const slide = ref(props.galleryImages[0]?.imageId);

  const galleryItems = ref<GalleryImage[]>([]);

  const virtualScroll = ref(null);
  const virtualScrollIndex = ref(0);

  const computePath = (path: string) => {
    return `${BLOB_URL}/${path}`;
  };
  watch(
    () => props.galleryImages,
    () => {
      galleryItems.value = props.galleryImages;
      slide.value = props.galleryImages[0]?.imageId ?? 0;
    },
    { deep: true }
  );

  const getImageSrc = (path: string) => {
    const baseURL = "https://lantau360storage.blob.core.windows.net";

    // Check if the image path starts with the specified URL
    if (path.startsWith(baseURL)) {
      // If it does, use the image path directly
      return path;
    } else {
      // If it doesn't, compute the path using the computePath function
      return computePath(path);
    }
  };

  function showImage(row: any) {
    slide.value = row.imageId;
  }

  function onVirtualScroll(details: any) {
    virtualScrollIndex.value = details.index;
  }

  function scrollLeft() {
    if (virtualScroll.value && virtualScrollIndex.value > 0) {
      virtualScrollIndex.value -= 1;

      (virtualScroll.value as any).scrollTo(virtualScrollIndex.value, "end-force");
      slide.value = galleryItems.value[virtualScrollIndex.value].imageId ?? 0;
    }
  }

  function scrollRight() {
    if (virtualScroll.value && virtualScrollIndex.value < galleryItems.value.length - 1) {
      virtualScrollIndex.value += 1;
      (virtualScroll.value as any).scrollTo(virtualScrollIndex.value, "start-force");

      slide.value = galleryItems.value[virtualScrollIndex.value].imageId ?? 0;
    }
  }
</script>

<style scoped>
  .bg-thumbnail {
    background: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAJYAAACWBAMAAADOL2zRAAAAG1BMVEXMzMyWlpaqqqq3t7fFxcW+vr6xsbGjo6OcnJyLKnDGAAAACXBIWXMAAA7EAAAOxAGVKw4bAAABAElEQVRoge3SMW+DMBiE4YsxJqMJtHOTITPeOsLQnaodGImEUMZEkZhRUqn92f0MaTubtfeMh/QGHANEREREREREREREtIJJ0xbH299kp8l8FaGtLdTQ19HjofxZlJ0m1+eBKZcikd9PWtXC5DoDotRO04B9YOvFIXmXLy2jEbiqE6Df7DTleA5socLqvEFVxtJyrpZFWz/pHM2CVte0lS8g2eDe6prOyqPglhzROL+Xye4tmT4WvRcQ2/m81p+/rdguOi8Hc5L/8Qk4vhZzy08DduGt9eVQyP2qoTM1zi0/uf4hvBWf5c77e69Gf798y08L7j0RERERERERERH9P99ZpSVRivB/rgAAAABJRU5ErkJggg==");
    background-size: cover;
    background-position: center center;
  }
</style>
