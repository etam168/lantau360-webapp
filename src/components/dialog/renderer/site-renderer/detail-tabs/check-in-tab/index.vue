<template>
  <suspense>
    <!-- "default" slot belongs to Suspense -->
    <template #default>
      <main-component :item="item" />
    </template>

    <!-- "fallback" slot belongs to Suspense -->
    <template #fallback> <div></div> </template>
  </suspense>
</template>

<script setup lang="ts">
  import { CategoryTypes } from "@/interfaces/types/category-types";
  const MainComponent = defineAsyncComponent({
    loader: () => import("./main-component.vue"),
    delay: 500
  });

  defineProps({
    item: {
      type: Object as PropType<CategoryTypes>,
      required: true
    }
  });
</script>
