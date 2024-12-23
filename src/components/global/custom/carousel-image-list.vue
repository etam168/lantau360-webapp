<template>
  <q-card bordered flat>
    <q-responsive :ratio="16 / 9">
      <q-carousel
        v-if="hasMultipleImage"
        swipeable
        animated
        :thumbnails="!fullscreen"
        :arrows="fullscreen"
        :prev-icon="fasChevronLeft"
        :next-icon="fasChevronRight"
        v-model="slide"
        v-model:fullscreen="fullscreen"
        class="bg-thumbnail"
      >
        <q-carousel-slide
          v-for="(item, index) in galleryImages"
          :key="index"
          :name="item.imageId"
          :img-src="getImageURL(item.imagePath)"
        ></q-carousel-slide>

        <template v-slot:control>
          <q-carousel-control
            position="top-right"
            :offset="[18, 18]"
            style="background: rgba(0, 0, 0, 0.3); padding: 4px 8px"
          >
            <q-btn
              flat
              dense
              color="white"
              size="sm"
              :icon="fullscreen ? fasCompress : fasExpand"
              @click="fullscreen = !fullscreen"
            >
              <q-tooltip class="bg-dark text-caption shadow-4">{{
                $t("action.fullScreen")
              }}</q-tooltip>
            </q-btn>
          </q-carousel-control>
        </template>
      </q-carousel>

      <q-img v-else :src="image">
        <div
          v-if="imageList.length > 0"
          class="absolute-top-right q-ma-md"
          :offset="[18, 18]"
          style="background: rgba(0, 0, 0, 0.3); padding: 4px 8px"
        >
          <q-btn
            flat
            dense
            color="white"
            size="sm"
            :icon="fullscreen ? fasCompress : fasExpand"
            @click="toggleFullscreen"
          >
            <q-tooltip class="bg-dark text-caption shadow-4">{{
              $t("action.fullScreen")
            }}</q-tooltip>
          </q-btn>
        </div>

        <!-- Fullscreen Dialog -->
        <q-dialog v-model="fullscreen" maximized>
          <q-img :src="image">
            <div
              class="absolute-top-right q-ma-md"
              style="background: rgba(0, 0, 0, 0.5); padding: 4px 8px"
            >
              <q-btn
                flat
                dense
                color="white"
                size="sm"
                :icon="fasCompress"
                @click="toggleFullscreen"
              >
                <q-tooltip class="bg-dark text-caption shadow-4">{{
                  $t("action.compress")
                }}</q-tooltip>
              </q-btn>
            </div>
          </q-img>
        </q-dialog>
      </q-img>
    </q-responsive>

    <q-separator color="white" />
  </q-card>
</template>

<script setup lang="ts">
  import {
    fasCompress,
    fasExpand,
    fasChevronLeft,
    fasChevronRight
  } from "@quasar/extras/fontawesome-v6";
  import { IMAGES } from "@/constants";
  import { GalleryImageType } from "@/interfaces/types/gallery-image-type";

  const { imageList } = defineProps<{
    imageList: GalleryImageType[];
  }>();

  const { getImageURL } = useUtilities();
  const galleryImages = computed(() => imageList);
  const fullscreen = ref(false);

  // Set slide to the first image's ID
  const slide = ref(galleryImages.value.length ? galleryImages.value[0].imageId : null);

  const hasMultipleImage = computed(() => {
    return imageList.length > 1;
  });

  const toggleFullscreen = () => {
    fullscreen.value = !fullscreen.value;
  };

  const image = computed(() => {
    return imageList.length === 1
      ? getImageURL(imageList[0].imagePath)
      : IMAGES.NO_IMAGE_AVAILABLE_PLACEHOLDER;
  });
</script>
