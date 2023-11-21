<!-- custom q-input component to work with vee-validate -->
<template>
  <q-input
    v-bind="$attrs"
    v-model="value"
    outlined
    stack-label
    :error-message="errorMessage"
    :error="!!errorMessage"
  >
  </q-input>
</template>

<script setup lang="ts">
  // Vue Import
  import { Ref } from "vue";
  import { useField } from "vee-validate";

  const props = defineProps({
    name: {
      type: String,
      required: true
    }
  });

  const { errorMessage, value } = useField(props.name) as {
    errorMessage: Ref<string>;
    value: Ref<string | number | null | undefined>;
  };
</script>
