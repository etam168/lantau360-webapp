<template>
  <q-card-actions align="center">
    <div class="text-h6 text-weight-medium">{{ props.title }}</div>
  </q-card-actions>

  <!-- <div class="text-h6 text-weight-medium">
    <slot></slot>
  </div> -->
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
