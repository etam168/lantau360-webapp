<template>
  <!-- <q-card-section class="gallery-card">
    <q-responsive :ratio="16 / 9">
      <q-img :src="imageSrc || ''">
        <template v-slot:error>
          <img :src="imageSrc" />
        </template>

        <template v-slot:loading>
          <div class="absolute-full flex flex-center bg-gray text-white">
            <q-inner-loading showing class="spinner-card row justify-center items-center">
              <q-spinner size="50px" color="primary" />
            </q-inner-loading>
          </div> </template
      ></q-img>
    </q-responsive>
  </q-card-section> -->

  <q-img :src="imageSrc || ''">
    <template v-slot:error>
      <img :src="imageSrc" />
    </template>

    <template v-slot:loading>
      <div class="absolute-full flex flex-center bg-gray text-white">
        <q-inner-loading showing class="spinner-card row justify-center items-center">
          <q-spinner size="50px" color="primary" />
        </q-inner-loading>
      </div>
    </template>
  </q-img>
</template>

<script setup lang="ts">
  import { computed } from "vue";
  import type { GalleryImageType } from "@/interfaces/types/gallery-image-type";
  import { useUtilities } from "@/composable/use-utilities";
  import { PLACEHOLDER_THUMBNAIL } from "@/constants";

  const props = defineProps({
    image: {
      type: [Object, File] as PropType<GalleryImageType | File>,
      required: true
    }
  });

  const { getImageURL } = useUtilities();

  const imageSrc = computed(() => {
    if (props.image instanceof File) {
      return URL.createObjectURL(props.image);
    } else if (typeof props.image === "object" && "imagePath" in props.image) {
      return getImageURL(props.image.imagePath);
    } else {
      return PLACEHOLDER_THUMBNAIL; // Return empty string or a placeholder image URL
    }
  });
</script>

<style scoped>
  /* .gallery-card {
    width: 100%;
    min-width: 318px;
  } */
</style>
