<template>
  <div class="no-data">
    <q-img src="@/assets/img/nodata.png" />
    <q-item-label class="text-h3 text-center q-mb-xl">
      {{ $t("errors.notDataFound") }}
    </q-item-label>
  </div>
</template>

<script setup lang="ts">
  // No script code is needed in this component.
</script>

<style scoped>
  .no-data {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 50vh;
  }
</style>
