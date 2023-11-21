<template>
  <q-input
    v-bind="$attrs"
    v-model="value"
    stack-label
    standout="bg-grey-7 text-white"
    :dark="false"
    mask="time"
    :autogrow="autoGrow"
    :error="!!errorMessage"
    :error-message="errorMessage"
  >
    <template v-slot:append>
      <q-icon name="access_time" class="cursor-pointer">
        <q-popup-proxy ref="qDateProxy" cover transition-show="scale" transition-hide="scale">
          <q-time v-model="value" color="green" format24h>
            <div class="row items-center justify-end">
              <q-btn v-close-popup label="Close" color="primary" flat />
            </div>
          </q-time>
        </q-popup-proxy>
      </q-icon>
    </template>
  </q-input>
</template>

<script setup lang="ts">
  import { computed, watch } from "vue";
  import { useField } from "vee-validate";

  const emits = defineEmits(["update:modelValue"]);
  const props = defineProps({
    name: {
      type: String,
      required: true
    },
    initialValue: {
      type: String
    },
    modelValue: {
      type: String
    },
    autoGrow: {
      type: Boolean,
      default: false
    }
  });

  const theModel = computed({
    get: () => props.modelValue,
    set: val => {
      emits("update:modelValue", val);
    }
  });

  const { errorMessage, value } = useField(props.name, undefined, {
    initialValue: props.initialValue
  });

  watch(value, () => {
    theModel.value = value.value;
  });
</script>
