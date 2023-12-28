<template>
  <q-field :borderless="true" :error="!!errorMessage" :error-message="errorMessage">
    <q-toggle v-model="value" v-bind="$attrs" color="primary" :label="lable" />
  </q-field>
</template>

<script setup lang="ts">
  // Vue Import
  import { useField } from "vee-validate";

  const props = defineProps({
    name: {
      type: String,
      required: true
    },
    lable: {
      type: String
    }
  });
  const { errorMessage, value } = useField(props.name);
</script>
