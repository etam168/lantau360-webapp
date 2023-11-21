<template>
  <q-list>
    <q-item dense class="q-pa-none">
      <q-item-section>
        <q-item-label lines="5" style="white-space: normal">{{ title }}</q-item-label>
      </q-item-section>
    </q-item>
  </q-list>
</template>

<script setup lang="ts">
  defineProps({
    title: {
      type: String,
      required: true
    }
  });
</script>
