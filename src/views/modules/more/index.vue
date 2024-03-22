<template>
  <suspense>
    <!-- "default" slot belongs to Suspense -->
    <template #default>
      <main-page />
    </template>

    <!-- "fallback" slot belongs to Suspense -->
    <template #fallback> <div></div> </template>
  </suspense>
</template>

<script setup lang="ts">
  const MainPage = defineAsyncComponent({
    loader: () => import("./main-page.vue"),
    delay: 500
  });
</script>
