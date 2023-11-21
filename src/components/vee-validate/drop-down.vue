<template>
  <q-field :borderless="true" :error="!!errorMessage" :error-message="errorMessage">
    <q-select
      map-options
      emit-value
      v-model="value"
      stack-label
      standout="bg-grey-7 text-white"
      :dark="false"
      options-dense
      initial
      :options="options"
      :label="label"
      style="width: 100%"
    >
      <template v-slot:option="scope">
        <q-item v-bind="scope.itemProps" clickable v-ripple>
          <q-item-section>
            <q-item-label>{{ scope.opt.label }}</q-item-label>
          </q-item-section>
        </q-item>
      </template>
    </q-select>
  </q-field>
</template>

<script setup lang="ts">
  import { useField } from "vee-validate";

  const props = defineProps({
    name: {
      type: String,
      required: true
    },
    label: {
      type: String
    },
    options: {
      type: Array,
      required: true
    }
  });

  const { errorMessage, value } = useField(props.name);
</script>
