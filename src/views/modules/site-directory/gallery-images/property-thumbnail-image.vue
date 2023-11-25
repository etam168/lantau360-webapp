<template>
  <q-card bordered flat square>
    <q-img
      v-bind="$attrs"
      fit="cover"
      class="cursor-pointer"
      :placeholder-src="PLACEHOLDER_THUMBNAIL"
      :ratio="1"
      :src="imagelink"
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
  import { computed, PropType } from "vue";

  // .ts files
  // import { BLOB_URL } from "@/constants";
  import { BLOB_URL, PLACEHOLDER_THUMBNAIL } from "@/constants";
  import { GalleryImage } from "@/interfaces/models/entities/image-list";
  // import { PropertyListing } from "@/interfaces/models/entities/property-listing";

  const props = defineProps({
    rowData: {
      type: Object as PropType<GalleryImage>,
      required: true
    }
  });

  const emits = defineEmits(["on-image"]);

  const imagelink = computed(() => {
    const url = `${BLOB_URL}/${props.rowData.imagePath}`;
    return url || PLACEHOLDER_THUMBNAIL;
  });

  function handleimage(props: any) {
    emits("on-image", props);
  }
</script>
