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
  // Vue Import
  import { PropType, Ref } from "vue";
  import { useField } from "vee-validate";

  const props = defineProps({
    name: {
      type: String,
      required: true
    },
    autoGrow: {
      type: Boolean,
      default: false
    },
    maxLenght: {
      type: Number,
      defualt: undefined
    },
    counter: {
      type: Boolean,
      default: false
    },
    disable: {
      type: Boolean,
      default: false
    },
    inputType: {
      type: String as PropType<any> | undefined,
      default: "text"
    }
  });

  const { errorMessage, value: untypedValue } = useField(() => props.name);
  const value = untypedValue as Ref<string | number | null>;
</script>
