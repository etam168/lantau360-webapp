<!-- vee-input.vue -->
<template>
  <q-input
    v-bind="$attrs"
    v-model="value"
    stack-label
    standout="bg-grey-7 text-white"
    :dark="false"
    :error="!!errorMessage"
    :error-message="errorMessage"
    :autogrow="autoGrow"
    :maxlength="maxLenght"
    :counter="counter"
    :disable="disable"
    :type="inputType"
  >
    <template v-for="(value, slotName) in $slots" :key="slotName">
      <slot :name="slotName" />
    </template>
  </q-input>
</template>

<script setup lang="ts">
  import { useField } from "vee-validate";

  const {
    name,
    autoGrow,
    maxLenght,
    counter,
    disable,
    inputType = "text"
  } = defineProps<{
    name: string;
    autoGrow?: boolean;
    maxLenght?: number;
    counter?: boolean;
    disable?: boolean;
    inputType?: string | undefined;
  }>();

  const { errorMessage, value: untypedValue } = useField(() => name);
  const value = untypedValue as Ref<string | number | null>;
</script>
