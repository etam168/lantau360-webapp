<template>
  <suspense>
    <!-- "default" slot belongs to Suspense -->
    <template #default>
      <main-page :entityKey />
    </template>

    <!-- "fallback" slot belongs to Suspense -->
    <template #fallback>
      <main-page-skeleton :entityKey />
    </template>
  </suspense>
</template>

<script setup lang="ts">
  import { EntityURLKey } from "@/constants";

  const entityKey: EntityURLKey = "FAVOURITE";
  const MainPage = defineAsyncComponent({
    loader: () => import("./main-page.vue"),
    delay: 500
  });
</script>
