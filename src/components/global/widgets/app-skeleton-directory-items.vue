<template>
  <div class="row">
    <div
      v-for="index in itemCount"
      :key="index"
      class="column q-gutter-sm q-mt-md items-center col-12 col-sm-6 col-md-3 col-lg-3"
    >
      <q-skeleton type="circle" size="64px" />
      <q-skeleton type="text" width="74px" />
    </div>
  </div>
</template>

<script setup lang="ts">
  const { itemCount = 1 } = defineProps<{
    itemCount?: number;
  }>();
</script>
