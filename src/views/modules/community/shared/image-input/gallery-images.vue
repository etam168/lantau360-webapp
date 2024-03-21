<template>
  <q-card-section class="q-pa-none" v-if="imageList.length <= 1">
    <image-input @uploadCallback="addGalleryImage" />
  </q-card-section>

  <q-card-section v-else>
    <div>
      {{ "Photos - " + (imageList.length - 1) + "/" + "10 - You can add upto 10 pics" }}
    </div>

    <animated-grid
      row-key="imageId"
      :rows="imageList"
      :hidePagination="true"
      @on-delete="handleDelete"
      @on-add-image="addGalleryImage"
      @on-drag-drop="handleDrapDrop"
    />
  </q-card-section>
</template>

<script setup lang="ts">
  import { PostingImages } from "@/interfaces/models/custom-models/gallery";

  // Custom Components
  import AnimatedGrid from "./animated-grid.vue";
  import ImageInput from "./image-input.vue";

  const emits = defineEmits(["delete-image", "upload-image", "handle-drag-drop"]);

  const postingImages = inject("images") as Ref<PostingImages>;

  const addGalleryImage = (images: any) => {
    for (let i = 0; i < images.length; i++) {
      const newImage = {
        index: imageList.value.length + 1,
        imagePath: URL.createObjectURL(images[i]),
        image: images[i],
        isAddCard: false
      };

      const insertIndex = imageList.value.findIndex(item => item.isAddCard === true);
      // If there is an object with isAddCard: true, insert before it; otherwise, insert at the end
      if (insertIndex !== -1) {
        imageList.value.splice(insertIndex, 0, newImage);
        // console.log(imageList.value.length);
        emits("upload-image", imageList.value.length - 1, newImage.image);
      } else {
        imageList.value.push(newImage);
      }
      postingImages.value.galleryImages = imageList.value;
    }
  };

  function handleDrapDrop() {
    emits("handle-drag-drop");
  }

  function handleDelete(value: any) {
    // console.log(value);
    const index = imageList.value.findIndex(image => image.index === value.index);

    if (index !== -1) {
      imageList.value.splice(index, 1);
      if (value.imageId != null) {
        emits("delete-image", value.imageId);
      }
    }
  }

  const imageList = computed(
    () =>
      postingImages?.value.galleryImages ?? [
        {
          index: 1,
          imagePath: "",
          isAddCard: true
        }
      ]
  );

  provide("imageList", imageList);

  watch(
    () => imageList.value.length,
    () => {
      postingImages.value.galleryImages = imageList.value;
    }
  );
</script>
