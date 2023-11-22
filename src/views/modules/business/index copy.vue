<template>
  <suspense>
    <template #default>
      <main-datatable />
    </template>
    <template #fallback>
      <div class="row justify-center items-center" style="height: 500px">
        <app-spinner size="10em" />
      </div>
    </template>
  </suspense>
</template>

<script setup lang="ts">
  // Custom Components
  import MainDatatable from "./main-datatable.vue";
  import AppSpinner from "@/components/widgets/app-spinner.vue";
</script>
