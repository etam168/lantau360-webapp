<template>
  <suspense>
    <!-- "default" slot belongs to Suspense -->
    <template #default>
      <main-page />
    </template>

    <!-- "fallback" slot belongs to Suspense -->
    <template #fallback>
      <home-skeleton />
    </template>
  </suspense>
</template>

<script setup lang="ts">
  import HomeSkeleton from "./section/home-skeleton.vue";
  const MainPage = defineAsyncComponent({
    loader: () => import("./main-page.vue"),
    delay: 500
  });
</script>
