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
          :key="row.businessId"
          :name="row.businessId"
          class="q-pa-none"
          :img-src="getImageSrc(row)"
          @click="onImageClick(row)"
        >
          <q-tooltip anchor="top middle" self="bottom middle" :offset="[10, 10]">
            <strong>Business Id:</strong> {{ row.businessId }}
          </q-tooltip>
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
  // Vue Import
  import { PropType, ref } from "vue";
  import { useRouter } from "vue-router";

  // .ts file
  import { BLOB_URL } from "@/constants";
  import { Business } from "@/interfaces/models/entities/business";
  import { useUtilities } from "@/composable/use-utilities";
  import imageNotFound from "@/assets/img/image_not_found.jpg";

  const props = defineProps({
    data: {
      type: Array as PropType<Business[] | null>,
      required: false,
      default: null
    }
  });

  const { aspectRatio } = useUtilities();

  const router = useRouter();
  const slideInterval = 10000;
  const data = ref(props.data);

  const slide = ref(data.value?.[0]?.businessId ?? 0);

  const onImageClick = (item: Business) => {
    router.push({
      name: "business-directory-item-detail",
      query: { directoryItemId: item.businessId }
    });
  };

  function getImageSrc(row: Business) {
    return row.imagePath !== null && row.imagePath !== ""
      ? `${BLOB_URL}/${row.imagePath}`
      : imageNotFound;
  }
</script>

<style>
  .q-carousel__arrow .q-icon {
    font-size: 46px;
  }
</style>
