<!-- app-skeleton-tab-items.vue -->
<template>
  <q-item class="q-gutter-sm" :class="$q.screen.lt.sm ? 'justify-center' : ''">
    <q-skeleton v-for="index in itemCount" :key="index" type="QChip" />
  </q-item>
</template>

<script setup lang="ts">
  const { itemCount = 1 } = defineProps<{
    itemCount?: number;
  }>();
</script>
