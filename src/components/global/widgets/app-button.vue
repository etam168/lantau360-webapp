<template>
  <q-btn v-bind="$attrs" color="primary">
    <!-- Dynamically inherit slots from parent -->

    <template v-for="slot in parentSlots" #[slot]>
      <slot :name="slot" />
    </template>
  </q-btn>
</template>

<script setup lang="ts">
  const parentSlots = computed(() => Object.keys(useSlots));
</script>
