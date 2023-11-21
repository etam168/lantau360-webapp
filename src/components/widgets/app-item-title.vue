<!-- app-item-title.vue -->
<template>
  <q-item-label class="text-subtitle1 text-weight-medium">
    {{ title }}
  </q-item-label>
</template>

<script setup lang="ts">
  // Define props
  defineProps({
    title: {
      type: String,
      required: false,
      default: ""
    }
  });
</script>
