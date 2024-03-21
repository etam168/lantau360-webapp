<template>
  <!-- <q-scroll-observer @scroll="onScroll" />
  <q-table
    v-bind="$attrs"
    card-container-class="q-col-gutter-sm"
    grid
    flat
    hide-bottom
    :pagination="{ rowsPerPage: 30 }"
  >
    <template #item="props">
      <ImageCard
        flat
        :row="props.row"
        @on-delete-gallery="handleDelete"
        @on-add-image="handleAddImage"
      />
    </template>

    <template v-slot:bottom="scope"> </template>
  </q-table> -->
  <div class="max-width-480 q-mx-none">
    <q-scroll-observer @scroll="onScroll" />
    <VueDraggableNext :list="rows" class="grid-container" @change="onMove">
      <div class="grid-item" v-for="row in rows" :key="row.imageId">
        <ImageCard
          flat
          :row="row"
          @on-delete-gallery="handleDelete"
          @on-add-image="handleAddImage"
          class="drag-handle bg-yellow"
        />
      </div>
    </VueDraggableNext>
  </div>
</template>

<script setup lang="ts">
  import { VueDraggableNext } from "vue-draggable-next";

  // Interface files
  import { GalleryImage } from "@/interfaces/models/custom-models/image-list";

  // Custom Components
  import ImageCard from "./image-card.vue";

  const emits = defineEmits(["on-delete", "on-detail", "on-add-image", "on-drag-drop"]);

  defineProps({
    hidePagination: { type: Boolean, default: false },
    imageCount: { type: Number },
    rows: Array<GalleryImage>
  });
  // provide("imageList", imageList);

  const isUpdateDialog = inject("isUpdateDialog");

  const scrollInfo = ref<any>({});

  function handleDelete(props: any) {
    emits("on-delete", props);
  }

  function handleAddImage(image: any) {
    emits("on-add-image", image);
  }
  // function handleDetail(props: any) {
  //   emits("on-detail", props);
  // }

  const onMove = () => {
    if (isUpdateDialog) emits("on-drag-drop");
  };

  function onScroll(info: any) {
    scrollInfo.value = info;
  }
</script>
<style scoped>
  .max-width-480 {
    max-width: 480px;
  }
  .grid-container {
    display: flex;
    flex-wrap: wrap;
  }
  .grid-item {
    margin: 2.5px;
  }
</style>
