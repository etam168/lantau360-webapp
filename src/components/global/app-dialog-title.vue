<template>
  <q-toolbar>
    <q-btn dense flat icon="arrow_back" v-close-popup></q-btn>

    <q-toolbar-title class="text-center text-weight-medium">
      <slot></slot>
      <!-- Default slot for content -->
    </q-toolbar-title>

    <!-- Invisible button to balance the actual button -->
    <q-btn dense flat icon="arrow_back" style="opacity: 0; pointer-events: none"></q-btn>
  </q-toolbar>
</template>

<script setup lang="ts">
  // No need for additional Composition API setup since we're only using v-close-popup
</script>
