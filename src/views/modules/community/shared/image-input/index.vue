<template>
  <gallery-image
    @upload-image="uploadGalleryImage"
    @delete-image="deleteImage"
    @handle-drag-drop="updateRanking"
  />
</template>

<script setup lang="ts">
  // Interface files
  import { PostingImages } from "@/interfaces/models/custom-models/gallery";

  //Custom Components
  import GalleryImage from "./gallery-images.vue";

  const props = defineProps({
    isEditDialog: {
      type: Boolean,
      default: true
    }
  });

  const emits = defineEmits(["on-upload", "deleteImage", "update-ranking"]);

  const postingImages = inject("images") as Ref<PostingImages>;

  const uploadGalleryImage = (rank: any, image: any) => {
    if (props.isEditDialog) emits("on-upload", rank, image);
  };

  const updateRanking = () => {
    emits("update-ranking");
  };

  const deleteImage = (image: any) => {
    emits("deleteImage", image);
  };

  onMounted(() => {
    postingImages.value;
  });
</script>

<style scoped>
  .image-container {
    display: flex;
    justify-content: center;
  }
</style>
