<template>
  <q-item-section v-bind="$attrs">
    <q-item-label>{{ label }}</q-item-label>
    <q-item-label caption>{{ caption }}</q-item-label>
  </q-item-section>
</template>

<script setup lang="ts">
  defineProps({
    caption: {
      type: [String, Number]
    },
    label: {
      type: String,
      required: true
    }
  });
</script>
