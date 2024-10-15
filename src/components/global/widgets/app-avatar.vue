<template>
  <q-avatar size="64px" style="background: #e9f8e8">
    <q-img :src="getImageURL(imagePath)" />
  </q-avatar>
</template>

<script setup lang="ts">
  const { imagePath } = defineProps<{
    imagePath: string;
  }>();

  const { getImageURL } = useUtilities();
</script>
