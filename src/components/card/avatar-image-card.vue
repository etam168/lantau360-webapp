<template>
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
  // Types
  import type { GalleryImageType } from "@/interfaces/types/gallery-image-type";

  // Constants
  import { PLACEHOLDER_THUMBNAIL } from "@/constants";

  const { image } = defineProps<{
    image: GalleryImageType | File;
  }>();

  const { getImageURL } = useUtilities();

  const imageSrc = computed(() => {
    if (image instanceof File) {
      return URL.createObjectURL(image);
    } else if (typeof image === "object" && "imagePath" in image) {
      return getImageURL(image.imagePath);
    } else {
      return PLACEHOLDER_THUMBNAIL; // Return empty string or a placeholder image URL
    }
  });
</script>
