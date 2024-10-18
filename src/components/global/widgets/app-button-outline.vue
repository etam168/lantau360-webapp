<template>
  <q-btn v-bind="$attrs" color="primary" no-caps rounded size="md" dense outline padding="2px md">
    <template #default>
      <slot></slot>
    </template>

    <template #loading>
      <slot name="loading">
        <!-- Default loading slot content if not provided -->
        <q-spinner-hourglass class="on-left" />
        Loading...
      </slot>
    </template>
  </q-btn>
</template>

<script setup lang="ts">
  // No additional script needed
</script>
