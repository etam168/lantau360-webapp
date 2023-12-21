<template>
  <q-card bordered flat square>
    <q-img
      v-bind="$attrs"
      fit="cover"
      class="cursor-pointer"
      :placeholder-src="PLACEHOLDER_THUMBNAIL"
      :ratio="1"
      :src="getImageSrc(imagelink)"
      style="height: 84px"
      @click="handleimage"
    >
      <template #error>
        <q-img :src="PLACEHOLDER_THUMBNAIL" />
      </template>

      <template #loading>
        <div class="absolute-full flex flex-center bg-gray text-white">
          <q-inner-loading showing class="spinner-card row justify-center items-center">
            <q-spinner size="50px" color="primary" />
          </q-inner-loading>
        </div>
      </template>
    </q-img>
  </q-card>
</template>

<script setup lang="ts">
  // .ts files
  import { BLOB_URL, PLACEHOLDER_THUMBNAIL } from "@/constants";
  import { GalleryImageType } from "@/interfaces/types/gallery-image-types";

  const props = defineProps({
    rowData: {
      type: Object as PropType<GalleryImageType>,
      required: true
    }
  });

  const emits = defineEmits(["on-image"]);

  const getImageSrc = (path: string | null) => {
    const baseURL = "https://lantau360storage.blob.core.windows.net";

    // Check if the imagelink is not null
    if (path && path.startsWith(baseURL)) {
      // If it does, use the image path directly
      return path;
    } else {
      // If it doesn't or is null, compute the path using the BLOB_URL
      return `${BLOB_URL}/${path || PLACEHOLDER_THUMBNAIL}`;
    }
  };

  const imagelink = computed(() => {
    return getImageSrc(props.rowData.imagePath) || PLACEHOLDER_THUMBNAIL;
  });

  function handleimage(props: any) {
    emits("on-image", props);
  }
</script>
