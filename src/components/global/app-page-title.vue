<template>
  <q-card-actions align="center" class="q-pa-none">
    <q-toolbar class="bg-white shadow-1">
      <q-toolbar-title class="text-center text-weight-medium">
        {{ props.title }}
      </q-toolbar-title>
    </q-toolbar>
  </q-card-actions>
</template>

<script setup lang="ts">
  const props = defineProps({
    title: {
      type: String,
      required: true
    }
  });
  // No script needed for this component as of now
</script>
