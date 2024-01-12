<template>
  <suspense>
    <!-- "default" slot belongs to Suspense -->
    <template #default>
      <main-page />
    </template>

    <!-- "fallback" slot belongs to Suspense -->
    <template #fallback>
      <favourite-skeleton />
    </template>
  </suspense>
</template>

<script setup lang="ts">
  import favouriteSkeleton from "./favourite-skeleton.vue";
  const MainPage = defineAsyncComponent({
    loader: () => import("./main-page.vue"),
    delay: 500
  });
</script>
