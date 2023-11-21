<!-- app-button-clear -->
<template>
  <q-btn dense unelevated color="white" round size="sm" v-bind="$attrs">
    <q-icon name="fa-solid fa-circle-xmark" size="sm" color="grey-5" class="custom-clear-btn" />
  </q-btn>
</template>

<script setup lang="ts">
  // No code needed yet
</script>

<style scoped lang="scss">
  .custom-clear-btn:hover {
    color: $grey-7 !important;
  }
</style>
