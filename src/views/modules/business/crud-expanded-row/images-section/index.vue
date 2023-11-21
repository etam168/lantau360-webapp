<template>
  <div v-if="galleryImages && galleryImages?.length > 0">
    <q-card bordered flat>
      <q-responsive :ratio="16 / 9">
        <q-carousel v-model="slide" animated arrows class="bg-thumbnail">
          <q-carousel-slide
            v-for="(image, index) in galleryImages"
            :key="index"
            :name="image.index"
            :img-src="image.imagePath"
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
          :items="galleryImages"
          :virtual-scroll-item-size="84"
          virtual-scroll-horizontal
          @virtual-scroll="onVirtualScroll"
          v-slot="{ item: row }"
        >
          <div class="q-pa-none" style="width: 84px">
            <business-thumbnail-image :rowData="row" @on-image="showImage(row)" />
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
  import { ref, PropType, onMounted } from "vue";
  import axios from "axios";
  import eventBus from "@/utils/event-bus";

  // .ts file
  import { BLOB_URL, PLACEHOLDER_THUMBNAIL } from "@/constants";

  // Custom Components
  import BusinessThumbnailImage from "./business-thumbnail-image.vue";
  import { BusinessImage } from "@/interfaces/businessImage";
  import { GalleryImage } from "@/interfaces/models/entities/image-list";

  // const props = defineProps({
  //   galleryImages: {
  //     type: Object as PropType<GalleryImage[]>,
  //     required: true
  //   }
  // });

  const props = defineProps({
    rowData: {
      type: Object as PropType<BusinessImage>
    }
  });

  const galleryImages = ref<Array<GalleryImage>>([]);

  function loadData() {
    const businessId = props.rowData.businessId;
    const url = `/BusinessImage/GalleryImages/${businessId}`;

    axios.get(url).then(response => {
      const rec = response.data as Array<BusinessImage>;
      // const gImages = rec.slice(0, 9).sort(function (x, y) {
      //   return x.ranking - y.ranking;
      // });

      galleryImages.value = [];

      for (const [index, gImage] of rec.entries()) {
        galleryImages.value.push({
          imageId: gImage.imageId,
          index: index + 2,
          imagePath: getImageURL(gImage.imagePath),
          isAddCard: false
        });
      }
    });
  }

  function getImageURL(imagePath: any) {
    return imagePath ? `${BLOB_URL}/${imagePath}` : PLACEHOLDER_THUMBNAIL;
  }

  // function getImageURL(imagePath: any) {
  //   return imagePath ? `${imagePath}` : PLACEHOLDER_THUMBNAIL;
  // }

  onMounted(() => {
    loadData();
    // eventBus.on("RefreshExpandedGallery", businessId => {
    //   if (businessId == props.rowData.businessId) {
    //     loadData();
    //   }
    // });

    eventBus.on("on-gallery-image-updates", () => {
      loadData();
    });
  });

  const slide = ref(2);

  const virtualScroll = ref(null);
  const virtualScrollIndex = ref(0);

  function showImage(row: any) {
    debugger;
    slide.value = row.index;
  }

  function onVirtualScroll(details: any) {
    virtualScrollIndex.value = details.index;
  }

  function scrollLeft() {
    if (virtualScroll.value && virtualScrollIndex.value > 0) {
      virtualScrollIndex.value -= 1;

      (virtualScroll.value as any).scrollTo(virtualScrollIndex.value, "end-force");
      slide.value = props.galleryImages[virtualScrollIndex.value]?.index ?? 0;
    }
  }

  function scrollRight() {
    if (virtualScroll.value && virtualScrollIndex.value < props.galleryImages.length - 1) {
      virtualScrollIndex.value += 1;
      (virtualScroll.value as any).scrollTo(virtualScrollIndex.value, "start-force");

      slide.value = props.galleryImages[virtualScrollIndex.value].index ?? 0;
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
