<template>
  <q-responsive :ratio="aspectRatio()">
    <q-skeleton type="rect" width="100%" />
  </q-responsive>
</template>

<script setup lang="ts">
  const { aspectRatio } = useUtilities();
</script>
