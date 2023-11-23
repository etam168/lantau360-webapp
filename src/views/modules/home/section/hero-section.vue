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
        arrows
        class="bg-primary"
      >
        <q-carousel-slide
          v-for="row in data"
          :key="row.siteId"
          :name="row.siteId"
          class="q-pa-none"
          :img-src="getImageSrc(row)"
          @click="onImageClick(row)"
        >
          <q-tooltip anchor="top middle" self="bottom middle" :offset="[10, 10]">
            <strong>SiteId Id:</strong> {{ row.siteId }}
          </q-tooltip>
        </q-carousel-slide>
      </q-carousel>
    </q-responsive>
  </div>
  <div v-else>
    <q-img src="@/assets/img/home-bg.webp" :ratio="aspectRatio()" />
  </div>
</template>

<script setup lang="ts">
  // Vue Import
  import { PropType, ref } from "vue";
  import { useRouter } from "vue-router";

  // .ts file
  import { BLOB_URL } from "@/constants";
  import { useUtilities } from "@/composable/use-utilities";
  import imageNotFound from "@/assets/img/image_not_found.jpg";
  import { Site } from "@/interfaces/site";

  const props = defineProps({
    data: {
      type: Array as PropType<Site[] | null>,
      required: false,
      default: null
    }
  });

  const { aspectRatio } = useUtilities();

  const router = useRouter();
  const slideInterval = 10000;
  const data = ref(props.data);

  const slide = ref(data.value?.[0]?.siteId ?? 0);

  const onImageClick = (item: Site) => {
    router.push({
      name: "directory-item-detail",
      query: { directoryItemId: item.siteId, group: 1 }
    });
  };

  function getImageSrc(row: Site) {
    return row.bannerPath !== null && row.bannerPath !== ""
      ? `${BLOB_URL}/${row.bannerPath}`
      : imageNotFound;
  }
</script>

<style>
  .q-carousel__arrow .q-icon {
    font-size: 46px;
  }
</style>
