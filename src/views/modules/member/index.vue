<template>
  <suspense>
    <!-- "default" slot belongs to Suspense -->
    <template #default>
      <main-datatable />
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
  // Vue Import
  import { defineAsyncComponent } from "vue";
  import AppSpinner from "@/components/widgets/app-spinner.vue";

  const mainDatatable = defineAsyncComponent({
    loader: () => import("./main-datatable.vue"),
    delay: 500
  });
</script>
