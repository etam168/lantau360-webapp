<!-- vee-input.vue -->
<template>
  <q-input
    v-bind="$attrs"
    v-model="value"
    bottom-slots
    stack-label
    standout="bg-grey-7 text-white"
    :dark="false"
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

  // const props = defineProps({
  //   name: {
  //     type: String,
  //     required: true
  //   },
  //   autoGrow: {
  //     type: Boolean,
  //     default: true
  //   },
  //   counter: {
  //     type: Boolean,
  //     default: false
  //   },
  //   disable: {
  //     type: Boolean,
  //     default: false
  //   },
  //   inputType: {
  //     type: String as PropType<any> | undefined,
  //     default: "text"
  //   }
  // });

  const {
    name
    // maxLenght,
    // counter,
    // disable,
    // inputType = "text"
  } = defineProps<{
    name: string;
  }>();
  // maxLenght?: number;
  // counter?: boolean;
  // disable?: boolean;
  // inputType?: string | undefined;

  const { errorMessage, value: untypedValue } = useField(() => name);
  const value = untypedValue as Ref<string | number | null>;

</script>

<style scoped>
  input {
    background-clip: text !important;
    -webkit-background-clip: text !important;
  }
</style>
