<!-- vee-input.vue -->
<template>
  <q-input
    v-bind="$attrs"
    v-model="value"
    bottom-slots
    stack-label
    standout="bg-grey-7 text-white"
    :dark="false"
    :mask="mask"
    :error="!!errorMessage"
    :error-message="errorMessage"
  >
    <template v-for="(value, slotName) in $slots" :key="slotName">
      <slot :name="slotName" />
    </template>
  </q-input>
</template>

<script setup lang="ts">
  import { useField } from "vee-validate";

  const { name, mask } = defineProps<{
    name: string;
    mask?: string;
  }>();

  const { errorMessage, value: untypedValue } = useField(() => name);
  const value = untypedValue as Ref<string | number | null>;
</script>

<style scoped>
  input {
    background-clip: text !important;
    -webkit-background-clip: text !important;
  }
</style>
