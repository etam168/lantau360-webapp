<template>
  <q-avatar size="64px" square class="bg-grey-2">
    <q-img
      ratio="1"
      :src="getImageURL(imagePath)"
      spinner-color="primary"
      spinner-size="24px"
      fit="cover"
      loading="lazy"
      @error="onImageError"
    >
      <template v-slot:error>
        <q-img :src="IMAGES.NO_IMAGE_AVAILABLE_PLACEHOLDER" fit="cover" />
      </template>
    </q-img>
  </q-avatar>
</template>

<script setup lang="ts">
  import { IMAGES } from "@/constants";

  const { imagePath } = defineProps<{
    imagePath: string;
  }>();

  const { getImageURL } = useUtilities();

  const onImageError = () => {
    console.warn(`Failed to load image: ${imagePath}`);
  };
</script>
