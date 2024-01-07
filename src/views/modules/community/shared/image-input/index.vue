<template>
  <!-- <q-list flat>
    <q-item>
      <q-item-section>
        <image-input
          style="height: 156px"
          @uploadCallback="addListingImage"
          label="Listing Image"
          :img-source="postingImages.listingImage?.imagePath"
        />
      </q-item-section>

      <q-item-section>
        <image-input
          style="height: 156px"
          @uploadCallback="addFeatureImage"
          label="Feature Image"
          :img-source="postingImages.featureImage?.imagePath"
        />
      </q-item-section>
    </q-item>
  </q-list> -->

  <gallery-image
    @upload-image="uploadGalleryImage"
    @delete-image="deleteImage"
    @handle-drag-drop="updateRanking"
  />
</template>

<script setup lang="ts">
  // Interface files
  import { PostingImages } from "@/interfaces/models/gallery";

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

  // const addFeatureImage = (image: any) => {
  //   postingImages.value.featureImage = {
  //     imagePath: URL.createObjectURL(image),
  //     image: image
  //   };
  //   if (props.isEditDialog) emits("on-upload", 3, image);
  // };

  const updateRanking = () => {
    emits("update-ranking");
  };

  const deleteImage = (image: any) => {
    emits("deleteImage", image);
  };

  // const addListingImage = (image: any) => {
  //   postingImages.value.listingImage = {
  //     imagePath: URL.createObjectURL(image),
  //     image: image
  //   };
  //   if (props.isEditDialog) emits("on-upload", 1, image);
  // };

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
