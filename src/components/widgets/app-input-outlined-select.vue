<template>
  <q-select
    outlined
    :options="selectOptions"
    v-model="value"
    map-options
    emit-value
    dense
    v-bind="$attrs"
    :error-message="errorMessage"
    :error="!!errorMessage"
  >
    <!-- <template v-if="icon" v-slot:append>
      <q-icon :name="icon" />
    </template> -->
  </q-select>
</template>

<script lang="ts">
  import { computed, defineComponent } from "vue";

  import { useField } from "vee-validate";

  export default defineComponent({
    name: "AppInputSelect",
    inheritAttrs: false,

    props: {
      name: {
        type: String,
        required: true
      },
      formValues: {
        type: Object
      },
      initialValue: {
        type: String
      }
    },

    setup(props, context) {
      const icon = computed(() => context.attrs["icon"]);

      const selectOptions = computed(() => context.attrs["selectOptions"]);
      const { errorMessage, value } = useField(props.name, undefined, {
        type: "select",
        initialValue: props.initialValue
      });

      return {
        icon,
        selectOptions,
        errorMessage,
        value
      };
    }
  });
</script>
