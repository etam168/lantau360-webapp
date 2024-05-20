<template>
  <suspense>
    <!-- "default" slot belongs to Suspense -->
    <template #default>
      <main-page />
    </template>

    <!-- "fallback" slot belongs to Suspense -->
    <template #fallback>
      <business-skeleton />
    </template>
  </suspense>
</template>

<script setup lang="ts">
  import BusinessSkeleton from "./business-skeleton.vue";
  const MainPage = defineAsyncComponent({
    loader: () => import("./main-page.vue"),
    delay: 100
  });
</script>
