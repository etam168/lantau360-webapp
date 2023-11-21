<template>
  <q-btn v-bind="$attrs" :color="color">
    <!-- Dynamically inherit slots from parent -->

    <template v-for="slot in parentSlots" #[slot]>
      <slot :name="slot" />
    </template>
  </q-btn>
</template>

<script setup lang="ts">
  // Vue Import
  import { computed, useSlots } from "vue";

  const parentSlots = computed(() => Object.keys(useSlots));

  defineProps({
    color: {
      type: String,
      default: "primary"
    }
  });
</script>
