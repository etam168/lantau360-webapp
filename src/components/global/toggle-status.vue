<template>
  <q-field :borderless="true" :error="!!errorMessage" :error-message="errorMessage">
    <q-toggle
      v-model="value"
      v-bind="$attrs"
      color="primary"
      :label="labelValue"
      :true-value="statusTrueValue"
      :false-value="statusTrueValue === 1 ? 0 : 1"
    />
  </q-field>
</template>

<script setup lang="ts">
  // Vue Import
  import { ref, watch, onMounted } from "vue";
  import { useField } from "vee-validate";

  const props = defineProps({
    name: {
      type: String,
      required: true
    },
    initialValue: {
      type: Number,
      default: 1
    }
  });

  const statusTrueValue = ref(1);

  const { errorMessage, value } = useField(props.name);

  const labelValue = ref(value.value === 1 ? "Active" : "Inactive");

  // Watch changes to the underlying value and update labelValue accordingly
  watch(value, newValue => {
    labelValue.value = newValue === 1 ? "Active" : "Inactive";
  });

  // Watch changes to labelValue and update the underlying value accordingly
  watch(labelValue, newLabelValue => {
    value.value = newLabelValue === "Active" ? 1 : 0;
  });

  // Set the initial value when the component is mounted
  onMounted(() => {
    value.value = props.initialValue;
  });
</script>
