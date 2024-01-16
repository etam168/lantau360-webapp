<template>
  <q-card bordered flat>
    <q-responsive :ratio="16 / 9">
      <q-carousel v-model="slide" animated class="bg-thumbnail">
        <q-carousel-slide
          v-for="(item, index) in imageList"
          :key="index"
          :name="item.imageId"
          :img-src="getImageURL(item.imagePath)"
        >
        </q-carousel-slide>
      </q-carousel>
    </q-responsive>

    <q-card-actions class="bg-grey-4">
      <q-btn class="q-mr-sm" round dense icon="chevron_left" color="grey-9" @click="scrollLeft" />
      <q-separator vertical color="white" />

      <q-toolbar-title class="q-pa-none q-ma-none">
        <q-virtual-scroll
          ref="virtualScroll"
          class="bg-grey-4 justify-center"
          :items="imageList"
          virtual-scroll-slice-size="6"
          virtual-scroll-item-size="84"
          virtual-scroll-horizontal
          @virtual-scroll="onVirtualScroll"
          v-slot="{ item: row }"
        >
          <q-avatar square size="96px">
            <q-img
              fit="cover"
              :ratio="1"
              class="cursor-pointer"
              :placeholder-src="PLACEHOLDER_THUMBNAIL"
              :src="getImageURL(row.imagePath)"
              @click="showImage(row)"
            >
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
        </q-virtual-scroll>
      </q-toolbar-title>

      <q-separator vertical color="white" />
      <q-btn class="q-ml-sm" round dense icon="chevron_right" color="grey-9" @click="scrollRight" />
    </q-card-actions>
  </q-card>
</template>

<script setup lang="ts">
  import { PLACEHOLDER_THUMBNAIL } from "@/constants";
  import { GalleryImageType } from "@/interfaces/types/gallery-image-types";

  const props = defineProps({
    imageList: {
      type: Object as PropType<GalleryImageType[]>,
      required: true
    }
  });

  const { getImageURL } = useUtilities();
  const imageList = computed(() => props.imageList);

  const slide = ref(imageList.value[0]?.imageId);

  const virtualScroll = ref();
  const virtualScrollIndex = ref(0);

  function showImage(row: any) {
    slide.value = row.imageId;
    virtualScrollIndex.value = imageList.value.findIndex(i => i.imageId == row.imageId);
  }

  function onVirtualScroll(details: any) {
    virtualScrollIndex.value = details.index;
  }

  function scrollLeft() {
    if (virtualScroll.value && virtualScrollIndex.value > 0) {
      virtualScrollIndex.value -= 1;
      virtualScroll.value.scrollTo(virtualScrollIndex.value, "end-force");
      slide.value = imageList.value[virtualScrollIndex.value]?.imageId ?? 0;
    }
  }

  function scrollRight() {
    if (virtualScroll.value && virtualScrollIndex.value < imageList.value.length - 1) {
      virtualScrollIndex.value += 1;
      virtualScroll.value.scrollTo(virtualScrollIndex.value, "start-force");

      slide.value = imageList.value[virtualScrollIndex.value].imageId ?? 0;
    }
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
