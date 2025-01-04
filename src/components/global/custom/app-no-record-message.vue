<template>
  <q-card-section class="text-center text-h6 text-grey-6 text-weight-bold full-width">
    {{ message }}
  </q-card-section>
</template>

<!-- class="text-h6 text-center q-pa-md text-grey-6 text-weight-bold" -->
<script setup lang="ts">
  // Props
  const { message } = defineProps<{
    message: string;
  }>();
</script>
