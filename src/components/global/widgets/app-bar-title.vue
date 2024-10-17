<template>
  <q-bar dense class="bg-primary text-white">
    <div class="col text-center text-uppercase">{{ title }}</div>
  </q-bar>
</template>

<script setup lang="ts">
  const { title } = defineProps<{
    title: string;
  }>();
</script>
