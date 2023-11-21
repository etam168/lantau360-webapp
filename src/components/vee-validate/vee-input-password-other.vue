<template>
  <q-input
    :type="showPassword ? 'text' : 'password'"
    v-bind="$attrs"
    v-model="value"
    stack-label
    standout="bg-grey-7 text-white"
    :autogrow="autoGrow"
    :error-message="errorMessage"
    :error="!!errorMessage"
  >
    <template v-for="(value, slotName) in $slots" :key="slotName">
      <slot :name="slotName" />
    </template>
    <template v-slot:append>
      <q-icon
        :name="showPassword ? 'visibility_off' : 'visibility'"
        class="cursor-pointer"
        @click="showPassword = !showPassword"
      />
    </template>
  </q-input>
</template>

<script setup lang="ts">
  import { Ref, ref } from "vue";
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
    initialValue: {
      type: [String, Number]
    },
    modelValue: {
      type: [String, Number]
    }
  });

  const showPassword = ref(false);

  const { errorMessage, value: untypedValue } = useField(() => props.name);
  const value = untypedValue as Ref<string | number | null>;
</script>
