<template>
  <q-item>
    <div v-html="translate(contentData?.contentData, contentData?.meta, 'contentData')"></div
  ></q-item>
</template>

<script setup lang="ts">
  // Props
  const { contentData } = defineProps<{
    contentData: Record<string, any>;
  }>();

  const { translate } = useUtilities();
</script>
