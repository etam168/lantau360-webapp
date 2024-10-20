<template>
    <q-item>
      <div v-html="contentData"></div
    ></q-item>
  </template>
  
  <script setup lang="ts">
    // Props
    const { contentData } = defineProps<{
      contentData: Record<string, any>;
    }>();
  </script>
  