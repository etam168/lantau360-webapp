<template>
  <q-field :borderless="true" :error="!!errorMessage" :error-message="errorMessage">
    <q-select
      map-options
      emit-value
      v-model="value"
      stack-label
      standout="bg-grey-7 text-white"
      :dark="false"
      :options="options"
      :option-label="optionLabel"
      :option-value="optionValue"
      :label="label"
      style="width: 100%"
      @update:modelValue="onValueUpdate"
    >
      <template v-slot:option="scope">
        <q-item v-bind="scope.itemProps" clickable v-ripple>
          <q-item-section>
            <q-item-label>{{ scope.opt.label }}</q-item-label>
          </q-item-section>
          <q-item-section side>
            <q-item-label caption
              ><q-badge color="green-2" text-color="black" :label="scope.opt.value"
            /></q-item-label>
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
    optionValue: {
      type: String,
      default: "value"
    },
    optionLabel: {
      type: String,
      default: "label"
    },
    label: {
      type: String
    },
    options: {
      type: Array,
      required: true
    }
  });

  const emits = defineEmits(["on-update"]);
  const { errorMessage, value } = useField(props.name);

  const onValueUpdate = (newValue: any) => {
    emits("on-update", newValue);
  };
</script>
