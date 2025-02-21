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
        @fullscreen="handleFullscreen"
        @mousedown="startPan"
        @mousemove="handlePan"
        @mouseup="endPan"
        @mouseleave="endPan"
      >
        <q-carousel-slide
          v-for="(item, index) in maskedGalleryItems"
          :key="index"
          :name="item.imageId"
        >
          <div
            ref="imageContainer"
            class="image-container"
            :style="fullscreen ? transformStyle : {}"
            @mousedown="startPan"
            @mousemove="handlePan"
            @mouseup="endPan"
            @mouseleave="endPan"
            @wheel="handleZoom"
            @touchstart="startPan"
            @touchmove="handlePan"
            @touchend="endPan"
          >
            <q-img :src="getImageURL(item.imagePath)" :style="imageStyle" :draggable="false" />
          </div>
        </q-carousel-slide>

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
              @click="toggleFullscreen"
            >
              <q-tooltip class="bg-dark text-caption shadow-4">
                {{ $t("action.fullScreen") }}
              </q-tooltip>
            </q-btn>
          </q-carousel-control>
        </template>
      </q-carousel>

      <q-img v-else :src="singleImage">
        <q-dialog v-model="fullscreen" maximized>
          <q-img :src="singleImage">
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
                <q-tooltip class="bg-dark text-caption shadow-4">
                  {{ $t("action.compress") }}
                </q-tooltip>
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
  import { ref, computed, watch } from "vue";
  import {
    fasCompress,
    fasExpand,
    fasChevronLeft,
    fasChevronRight
  } from "@quasar/extras/fontawesome-v6";
  import { IMAGES } from "@/constants";
  import { GalleryImageType } from "@/interfaces/types/gallery-image-type";

  // Props
  const {
    galleryItems,
    displayMask = 0,
    category
  } = defineProps<{
    galleryItems: GalleryImageType[];
    displayMask?: number;
    category?: { displayMask?: number };
  }>();

  const { getImageURL } = useUtilities();

  // State

  const imageContainer = ref<HTMLElement | null>(null);
  const fullscreen = ref(false);
  const slide = ref(galleryItems[0]?.imageId || "");
  const zoom = ref<number>(1);
  const isPanning = ref<boolean>(false);
  const startX = ref<number>(0);
  const startY = ref<number>(0);
  const translateX = ref<number>(0);
  const translateY = ref<number>(0);
  const lastTranslateX = ref<number>(0);
  const lastTranslateY = ref<number>(0);
  const zoomOrigin = ref<string>("center center");

  // Computed Properties
  const effectiveDisplayMask = computed(() => {
    const categoryDisplayMask = category?.displayMask;
    return categoryDisplayMask !== undefined && categoryDisplayMask !== 0
      ? categoryDisplayMask
      : displayMask;
  });

  const handleFullscreen = (value: boolean) => {
    fullscreen.value = value;
  };

  const imageStyle = computed(() => ({
    transform: fullscreen.value
      ? `scale(${zoom.value}) translate(${translateX.value}px, ${translateY.value}px)`
      : "none",
    transformOrigin: zoomOrigin.value,
    transition: isPanning.value ? "none" : "transform 0.2s ease-out",
    maxWidth: "100%",
    maxHeight: "100%",
    objectFit: "contain"
  }));

  const transformStyle = computed(() => ({
    cursor: isPanningAllowed.value ? (isPanning.value ? "grabbing" : "grab") : "default",
    overflow: "hidden",
    width: "100%",
    height: "100%"
  }));

  const isPanningAllowed = computed(() => fullscreen.value && zoom.value > 1);

  const maskedGalleryItems = computed(() =>
    effectiveDisplayMask.value < 1
      ? galleryItems
      : galleryItems.filter((_, index) => !(effectiveDisplayMask.value & (1 << index)))
  );

  const hasMultipleImage = computed(() => maskedGalleryItems.value.length > 1);

  const singleImage = computed(() =>
    maskedGalleryItems.value.length === 1
      ? getImageURL(maskedGalleryItems.value[0].imagePath)
      : IMAGES.NO_IMAGE_AVAILABLE_PLACEHOLDER
  );

  const startPan = (event: MouseEvent | TouchEvent) => {
    if (!isPanningAllowed.value) return;

    event.preventDefault();
    isPanning.value = true;

    const e = "touches" in event ? event.touches[0] : event;
    startX.value = e.clientX - lastTranslateX.value;
    startY.value = e.clientY - lastTranslateY.value;
  };

  const handlePan = (event: MouseEvent | TouchEvent) => {
    if (!isPanning.value || !isPanningAllowed.value) return;

    event.preventDefault();
    const e = "touches" in event ? event.touches[0] : event;

    const newTranslateX = e.clientX - startX.value;
    const newTranslateY = e.clientY - startY.value;

    // Calculate boundaries
    const maxPanX = ((zoom.value - 1) * window.innerWidth) / 2;
    const maxPanY = ((zoom.value - 1) * window.innerHeight) / 2;

    // Apply boundaries
    translateX.value = Math.min(Math.max(newTranslateX, -maxPanX), maxPanX);
    translateY.value = Math.min(Math.max(newTranslateY, -maxPanY), maxPanY);
  };

  const endPan = () => {
    if (!isPanning.value) return;

    isPanning.value = false;
    lastTranslateX.value = translateX.value;
    lastTranslateY.value = translateY.value;
  };

  const handleZoom = (event: WheelEvent) => {
    if (!fullscreen.value) return;

    event.preventDefault();
    const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
    const offsetX = ((event.clientX - rect.left) / rect.width) * 100;
    const offsetY = ((event.clientY - rect.top) / rect.height) * 100;
    zoomOrigin.value = `${offsetX}% ${offsetY}%`;

    const delta = event.deltaY < 0 ? 1.1 : 0.9;
    const newZoom = Math.min(Math.max(1, zoom.value * delta), 4);

    // If zooming out, adjust translation to prevent jumping
    if (newZoom < zoom.value) {
      const scale = newZoom / zoom.value;
      translateX.value *= scale;
      translateY.value *= scale;
      lastTranslateX.value = translateX.value;
      lastTranslateY.value = translateY.value;
    }

    zoom.value = newZoom;

    // Reset panning if zoom is back to normal
    if (zoom.value === 1) {
      resetZoomAndPan();
    }
  };

  const toggleFullscreen = () => {
    fullscreen.value = !fullscreen.value;
  };


  const resetZoomAndPan = () => {
    zoom.value = 1;
    translateX.value = 0;
    translateY.value = 0;
    lastTranslateX.value = 0;
    lastTranslateY.value = 0;
    zoomOrigin.value = "center center";
    isPanning.value = false;
  };

  // Watch handlers
  watch(fullscreen, newVal => {
    if (!newVal) {
      resetZoomAndPan();
    }
  });

  watch(slide, () => {
    resetZoomAndPan();
  });

  // Reset on exit fullscreen or slide change
  watch(fullscreen, newVal => {
    if (!newVal) resetZoomAndPan();
  });

  onUnmounted(() => {
    if (imageContainer.value) {
      imageContainer.value.removeEventListener("wheel", handleZoom);
    }
  });
</script>

<style scoped>
  .image-container {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    user-select: none;
    overflow: hidden;
    position: relative;
  }

  .image-container img {
    pointer-events: none;
    user-select: none;
    -webkit-user-drag: none;
  }
</style>
