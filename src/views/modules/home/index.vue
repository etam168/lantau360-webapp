<template>
  <suspense>
    <!-- "default" slot belongs to Suspense -->
    <template #default>
      <main-page />
    </template>

    <!-- "fallback" slot belongs to Suspense -->
    <template #fallback>
      <main-page-skeleton :entityKey />
    </template>
  </suspense>
</template>

<script setup lang="ts">
  // .ts file
  import MainPageSkeleton from "@/components/global/skeleton/main-page-skeleton.vue";
  import { EntityURLKey } from "@/constants";

  const entityKey: EntityURLKey = "SITE";
  const MainPage = defineAsyncComponent({
    loader: () => import("./main-page.vue"),
    delay: 100
  });
</script>
