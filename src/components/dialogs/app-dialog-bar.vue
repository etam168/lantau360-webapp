<template>
  <q-header elevated class="bg-primary text-white items-center row" style="height: 32px">
    <q-bar class="bg-primary" style="width: 100%">
      <div class="text-h6 text-white">{{ barTitle }}</div>
      <q-space />
      <div class="text-h6 text-white">{{ name }}</div>
      <q-space />
      <q-btn dense icon="close" color="red" v-close-popup size="xs">
        <q-tooltip class="bg-white text-primary">Close</q-tooltip>
      </q-btn>
    </q-bar>
    <q-separator />
  </q-header>
</template>

<script setup lang="ts">
  defineProps({
    barTitle: {
      type: String
    },
    name: {
      type: String
    }
  });
</script>
