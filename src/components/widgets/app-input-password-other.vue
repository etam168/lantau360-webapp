<template>
  <q-input
    :type="showPassword ? 'text' : 'password'"
    v-bind="$attrs"
    outlined
    stack-label
    :model-value="modelValue"
    :error-message="errorMessage"
    :error="!!errorMessage"
  >
    <template v-for="slot in parentSlots" #[slot]>
      <slot :name="slot" />
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

<script lang="ts">
  import { computed, defineComponent, ref } from "vue";
  import { useField } from "vee-validate";

  export default defineComponent({
    name: "AppInputPassword",
    inheritAttrs: false,

    props: {
      name: {
        type: String,
        required: true
      },
      initialValue: {
        type: [String, Number]
      },
      modelValue: {
        type: [String, Number]
      }
    },

    emit: ["update:modelValue"],

    setup(props, ctx) {
      const parentSlots = computed(() => Object.keys(ctx.slots));
      const showPassword = ref(false);
      const { errorMessage, value } = useField(props.name, undefined, {
        initialValue: props.initialValue
      });

      return {
        errorMessage,
        value,
        showPassword,
        parentSlots
      };
    }
  });
</script>
