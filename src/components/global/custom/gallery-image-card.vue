<template>
  <q-card class="gallery-card">
    <q-img :src="imageSrc" :ratio="4 / 3" class="image-with-border" />
    <q-card-actions align="right">
      <q-btn round size="xs" color="red" :icon="fasTrash" @click="emit('delete')">
        <q-tooltip>{{ $t("action.delete") }}</q-tooltip>
      </q-btn>
      <q-btn round size="xs" color="primary" :icon="fasPencil" @click="emit('edit')">
        <q-tooltip>{{ $t("action.edit") }}</q-tooltip>
      </q-btn>
    </q-card-actions>
  </q-card>
</template>

<script setup lang="ts">
  import { fasTrash, fasPencil } from "@quasar/extras/fontawesome-v6";
  import { computed } from "vue";
  import type { GalleryImageType } from "@/interfaces/types/gallery-image-type";
  import { useUtilities } from "@/composable/use-utilities";

  const emit = defineEmits<{
    (e: "delete"): void;
    (e: "edit"): void;
  }>();

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
      console.error("Invalid image prop:", image);
      return ""; // Return empty string or a placeholder image URL
    }
  });
</script>

<style scoped>
  .gallery-card {
    width: 100%;
    min-width: 128px;
  }

  .image-with-border {
    border-bottom: 1px solid #e0e0e0;
  }
</style>
