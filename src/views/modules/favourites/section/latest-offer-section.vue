<template>
  <q-card flat class="my-card q-ma-lg">
    <q-card-actions class="q-pa-none">
      <p class="q-mb-none">Latest Offer</p>
      <q-space />
      <q-btn
        flat
        icon-right="keyboard_double_arrow_right"
        label="See All"
        class="text-capitalize q-pa-none"
      />
    </q-card-actions>
  </q-card>

  <q-card flat>
    <q-card-section horizontal class="q-py-none">
      <q-virtual-scroll
        ref="virtualScroll"
        class="full-width justify-center"
        :items="galleryImages"
        :virtual-scroll-item-size="100"
        virtual-scroll-horizontal
        @virtual-scroll="onVirtualScroll"
        v-slot="{ item: row }"
      >
        <div class="q-pa-none" style="width: 260px">
          <q-card class="my-card" flat bordered>
            <q-img src="https://cdn.quasar.dev/img/parallax2.jpg" />

            <q-card-section>
              <div class="text-overline text-orange-9">Offer 1</div>
              <div class="text-overline q-mb-xs">Offer 2</div>
            </q-card-section>

            <q-card-actions>
              <q-space />
              <q-btn flat color="primary" label="More Details" />
            </q-card-actions>
          </q-card>
        </div>
      </q-virtual-scroll>
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
  // Vue Import
  import { onMounted, ref } from "vue";
  import { GalleryImage } from "@/interfaces/models/entities/image-list";
  // .ts file
  import axios from "axios";
  import eventBus from "@/utils/event-bus";
  import { BusinessImage } from "@/interfaces/businessImage";
  import { BLOB_URL, PLACEHOLDER_THUMBNAIL } from "@/constants";

  const galleryImages = ref<Array<GalleryImage>>([]);
  const virtualScrollIndex = ref(0);

  function loadData() {
    // const businessId = props.rowData.businessId;
    const url = `/BusinessImage/GalleryImages/1`;

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

  function onVirtualScroll(details: any) {
    virtualScrollIndex.value = details.index;
  }

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
</script>
