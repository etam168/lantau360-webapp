<template>
  <suspense>
    <!-- "default" slot belongs to Suspense -->
    <template #default>
      <main-page />
    </template>

    <!-- "fallback" slot belongs to Suspense -->
    <template #fallback>
      <div class="row justify-center items-center" style="height: 500px">
        <app-spinner size="10em" />
      </div>
    </template>
  </suspense>
</template>

<script setup lang="ts">
  import { defineAsyncComponent } from "vue";
  import AppSpinner from "@/components/widgets/app-spinner.vue";

  const MainPage = defineAsyncComponent({
    loader: () => import("./main-page.vue"),
    delay: 500
  });
</script>
