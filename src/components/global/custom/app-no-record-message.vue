<template>
  <q-card-actions align="center" class="text-subtitle1 text-grey-6 text-weight-medium full-width">
    {{ message }}
  </q-card-actions>
</template>

<script setup lang="ts">
  // Props
  const { message } = defineProps<{
    message: string;
  }>();
</script>
