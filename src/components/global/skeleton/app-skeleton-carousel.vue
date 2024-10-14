<template>
  <q-responsive :ratio="aspectRatio()">
    <q-skeleton height="566.55px" width="100%" />
  </q-responsive>
</template>

<script setup lang="ts">
  const { aspectRatio } = useUtilities();
</script>
