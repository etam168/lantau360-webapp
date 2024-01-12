<template>
  <suspense>
    <!-- "default" slot belongs to Suspense -->
    <template #default>
      <community-skeleton />
    </template>

    <!-- "fallback" slot belongs to Suspense -->
    <template #fallback>
      <community-skeleton />
    </template>
  </suspense>
</template>

<script setup lang="ts">
  import communitySkeleton from "./community-skeleton.vue";
  // const MainPage = defineAsyncComponent({
  //   loader: () => import("./main-page.vue"),
  //   delay: 500
  // });
</script>
