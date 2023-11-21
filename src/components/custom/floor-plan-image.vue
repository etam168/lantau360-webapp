<template>
  <q-card flat square class="bg-white">
    <q-img :src="imagePath" :ratio="16 / 9" />

    <q-card-actions align="center">
      <div class="text-subtitle1">Floor Plan</div>
    </q-card-actions>
  </q-card>
</template>

<script setup lang="ts">
  // Vue Import
  import { Ref, computed, inject } from "vue";

  // .ts file
  import { BLOB_URL, PLACEHOLDER_THUMBNAIL } from "@/constants";

  const floorPlanImage = inject("floorPlanImage") as Ref<any>;

  const imagePath = computed(() => {
    if (floorPlanImage.value == null || floorPlanImage.value === "") {
      return PLACEHOLDER_THUMBNAIL;
    } else if (!isImage(floorPlanImage.value)) {
      return getImageURL(floorPlanImage.value);
    } else {
      return URL.createObjectURL(floorPlanImage.value);
    }
  });

  function getImageURL(imagePath: any) {
    return imagePath ? `${BLOB_URL}/${imagePath}` : PLACEHOLDER_THUMBNAIL;
  }

  function isImage(value: any) {
    return value && value.type;
  }
</script>
