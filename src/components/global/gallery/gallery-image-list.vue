<template>
  <q-card bordered flat>
    <q-responsive :ratio="16 / 9">
      <q-carousel v-model="slide" animated class="bg-thumbnail">
        <q-carousel-slide
          v-for="(item, index) in galleryImages"
          :key="index"
          :name="item.imageId"
          :img-src="getImageURL(item.imagePath)"
        >
        </q-carousel-slide>
      </q-carousel>
    </q-responsive>

    <q-separator color="white" />

    <q-card-actions class="bg-grey-4 q-py-none" v-if="galleryImages.length > 1">
      <q-btn
        v-show="virtualScrollIndex > 0"
        round
        dense
        icon="chevron_left"
        color="grey-9"
        @click="scrollLeft"
      />

      <q-toolbar-title class="q-pa-none q-mx-sm">
        <q-virtual-scroll
          ref="virtualScroll"
          class="bg-grey-4"
          :items="galleryImages"
          virtual-scroll-slice-size="6"
          virtual-scroll-item-size="84"
          virtual-scroll-horizontal
          @virtual-scroll="onVirtualScroll"
        >
          <template v-slot:before>
            <q-separator vertical color="white" />
          </template>

          <template v-slot="{ item: row, index }">
            <q-avatar square size="84px" :style="getImgStyle(index)">
              <q-img
                fit="cover"
                :ratio="1"
                class="cursor-pointer"
                :placeholder-src="PLACEHOLDER_THUMBNAIL"
                :src="getImageURL(row.imagePath)"
                @click="showImage(row)"
              >
                <div v-if="index === virtualScrollIndex" class="absolute-full flex flex-center" />

                <template #error>
                  <q-img :src="PLACEHOLDER_THUMBNAIL" />
                </template>

                <template #loading>
                  <div class="absolute-full flex flex-center bg-gray text-white">
                    <q-inner-loading showing class="spinner-card row justify-center items-center">
                      <q-spinner size="50px" color="primary" />
                    </q-inner-loading>
                  </div>
                </template>
              </q-img>
            </q-avatar>

            <q-separator vertical color="white" />
          </template>
        </q-virtual-scroll>
      </q-toolbar-title>

      <q-btn
        v-show="virtualScrollIndex < galleryImages.length - 1"
        round
        dense
        icon="chevron_right"
        color="grey-9"
        @click="scrollRight"
      />
    </q-card-actions>

    <q-separator color="white" />
  </q-card>
</template>

<script setup lang="ts">
  import { PLACEHOLDER_THUMBNAIL } from "@/constants";
  import { GalleryImageType } from "@/interfaces/types/gallery-image-types";

  const { getImageURL } = useUtilities();
  const props = defineProps({
    imageList: {
      type: Object as PropType<GalleryImageType[]>,
      required: true
    }
  });

  const galleryImages = computed(() => props.imageList);
  const slide = ref(galleryImages.value[0]?.imageId);

  const virtualScroll = ref();
  const virtualScrollIndex = ref(0);

  function getImgStyle(index: number) {
    return index === virtualScrollIndex.value
      ? "transform: scale(1.08); background-color: #888; background-blend-mode: multiply; transition: all 0.7s ease;"
      : "transition: none;";
  }

  function onVirtualScroll(details: any) {
    virtualScrollIndex.value = details.index;
  }

  function scrollLeft() {
    if (virtualScroll.value && virtualScrollIndex.value > 0) {
      virtualScrollIndex.value -= 1;
      virtualScroll.value.scrollTo(virtualScrollIndex.value, "end-force");
      slide.value = galleryImages.value[virtualScrollIndex.value]?.imageId ?? 0;
    }
  }

  function scrollRight() {
    if (virtualScroll.value && virtualScrollIndex.value < galleryImages.value.length - 1) {
      virtualScrollIndex.value += 1;
      virtualScroll.value.scrollTo(virtualScrollIndex.value, "start-force");

      slide.value = galleryImages.value[virtualScrollIndex.value].imageId ?? 0;
    }
  }

  function showImage(row: any) {
    slide.value = row.imageId;
    virtualScrollIndex.value = galleryImages.value.findIndex(i => i.imageId == row.imageId);
  }

  onMounted(() => {
    initvirtualScroll();
  });

  onUpdated(() => {
    initvirtualScroll();
  });

  function initvirtualScroll() {
    virtualScroll.value.reset();

    virtualScroll.value.refresh(0);
    virtualScroll.value.scrollTo(0, "start-force");
  }
</script>
