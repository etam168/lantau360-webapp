<template>
  <q-card v-if="!row.isAddCard">
    <q-img
      :placeholder-src="PLACEHOLDER_THUMBNAIL"
      :src="row.imagePath"
      style="width: 133px; height: 100px"
    >
      <template v-slot:error>
        <div class="absolute-full flex flex-center bg-primary text-white">Cannot load image</div>
      </template>

      <template v-slot:loading>
        <div class="absolute-full flex flex-center bg-gray text-white">
          <q-inner-loading showing class="spinner-card row justify-center items-center">
            <q-spinner-gears size="50px" color="primary" />
          </q-inner-loading>
        </div>
      </template>
    </q-img>

    <q-badge class="absolute-bottom-right q-pl-sm" color="transparent">
      <app-button round color="grey" icon="delete" size="xs" @click="onDeleteImage" />
    </q-badge>
  </q-card>

  <image-input v-else @uploadCallback="addGalleryImage" :isSmallSize="true" />
</template>

<script setup lang="ts">
  // Interface files
  import { GalleryImage } from "@/interfaces/models/custom-models/image-list";

  // .ts files
  import { PLACEHOLDER_THUMBNAIL } from "@/constants";

  // Custom Components
  import ImageInput from "./image-input.vue";

  const props = defineProps({
    row: {
      type: Object as PropType<GalleryImage>,
      required: true
    }
  });
  const emits = defineEmits(["on-delete-gallery", "on-add-image"]);

  function addGalleryImage(image: any) {
    emits("on-add-image", image);
  }
  function onDeleteImage() {
    emits("on-delete-gallery", props.row);
  }
</script>
