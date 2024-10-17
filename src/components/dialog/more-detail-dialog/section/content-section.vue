<template>
  <q-item>
    <div v-html="translate(moreData?.contentData, moreData?.meta, 'contentData')"></div
  ></q-item>
</template>

<script setup lang="ts">
  // Props
  const { moreData } = defineProps<{
    moreData: any;
  }>();

  const { translate } = useUtilities();
</script>
