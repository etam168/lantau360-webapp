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
  >
    <template v-slot:after>
      <q-btn round dense flat icon="info" color="primary">
        <q-tooltip
          ><div><q-img :src="slotImage" style="width: 300px" /></div>
        </q-tooltip>
      </q-btn>
    </template>
  </q-input>
</template>

<script setup lang="ts">
  // Vue Import
  import { useField } from "vee-validate";

  const props = defineProps({
    name: {
      type: String,
      required: true
    },
    slotImage: {
      type: String,
      required: true
    }
  });

  const { errorMessage, value: untypedValue } = useField(() => props.name);
  const value = untypedValue as Ref<string | number | null>;
</script>

<style lang="scss">
  .q-field__after {
    padding-left: 0px !important;
  }
</style>
