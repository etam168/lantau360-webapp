<!-- vee-tel-input.vue -->
<template>
  <vue-tel-input
    v-bind="$attrs"
    v-model="value"
    mode="international"
    :error="!!errorMessage"
    :error-message="errorMessage"
    standout="bg-grey-7 text-white"
    :dark="false"
    :enabledCountryCode="false"
  >
    <template v-for="(value, slotName) in $slots" :key="slotName">
      <slot :name="slotName" />
    </template>
  </vue-tel-input>
</template>

<script setup lang="ts">
  // Vue Import
  import { Ref } from "vue";
  import { useField } from "vee-validate";
  import { VueTelInput } from "vue-tel-input";
  import "vue-tel-input/vue-tel-input.css";

  const props = defineProps({
    name: {
      type: String,
      required: true
    }
  });

  const { errorMessage, value: untypedValue } = useField(() => props.name);
  const value = untypedValue as Ref<string | number | null>;
</script>
