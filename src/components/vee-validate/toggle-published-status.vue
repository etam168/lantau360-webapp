<template>
  <q-field
    :borderless="true"
    :error="!!errorMessage"
    :error-message="errorMessage"
    hide-bottom-space
  >
    <q-toggle
      v-model="value"
      v-bind="$attrs"
      color="primary"
      :label="labelValue"
      :true-value="statusTrueValue"
      :false-value="2"
    />
  </q-field>
</template>

<script setup lang="ts">
  // Vue Import
  import { ref, watch } from "vue";
  import { useField } from "vee-validate";

  const props = defineProps({
    name: {
      type: String,
      required: true
    }
  });

  const statusTrueValue = ref(1);

  const { errorMessage, value } = useField(props.name);

  const labelValue = ref(value.value == 1 ? "Published" : "Not Published");

  // Watch changes to the underlying value and update labelValue accordingly
  watch(value, newValue => {
    labelValue.value = newValue == 1 ? "Published" : "Not Published";
  });

  // Watch changes to labelValue and update the underlying value accordingly
  watch(labelValue, newLabelValue => {
    value.value = newLabelValue === "Published" ? 1 : 2;
  });
</script>
