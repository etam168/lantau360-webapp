<template>
  <q-input
    v-bind="$attrs"
    v-model="value"
    outlined
    color="green"
    stack-label
    :error-message="errorMessage"
    :error="!!errorMessage"
  >
  </q-input>
</template>

<script lang="ts">
  import { computed, defineComponent, watch } from "vue";

  import { useField } from "vee-validate";

  export default defineComponent({
    name: "AppInput",
    inheritAttrs: false,

    props: {
      name: {
        type: String,
        required: true
      },
      initialValue: {
        type: String
      },
      modelValue: {
        type: [String, Number]
      }
    },

    emit: ["update:modelValue"],

    setup(props, context) {
      const theModel = computed({
        get: () => props.modelValue,
        set: val => {
          context.emit("update:modelValue", val);
        }
      });

      const { errorMessage, value } = useField(props.name, undefined, {
        initialValue: props.initialValue
      });

      watch(value, () => {
        theModel.value = value.value;
      });

      return {
        errorMessage,
        value,
        theModel
      };
    }
  });
</script>
