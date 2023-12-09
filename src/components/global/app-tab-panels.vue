<template>
  <q-tab-panels v-bind="$attrs" :model-value="modelValue" @update:model-value="updateValue">
    <slot></slot>
  </q-tab-panels>
</template>

<script setup lang="ts">
  defineProps({
    modelValue: [String, Number]
  });

  const emit = defineEmits(["update:modelValue"]);

  // Function to emit the update event to the parent.
  function updateValue(value: string | number) {
    emit("update:modelValue", value);
  }
</script>
