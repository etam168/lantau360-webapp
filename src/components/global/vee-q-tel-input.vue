<!-- vee-input.vue -->
<template>
  <q-tel-input
    v-bind="$attrs"
    v-model="value"
    stack-label
    standout="bg-grey-7 text-white"
    :error="!!errorMessage"
    :error-message="errorMessage"
    :default-country="defaultIso"
    :dropdown-options="options"
    @country="selectedCountry"
  >
    <!-- <template v-slot:before>
      <q-item-label>{{ country.emoji }}</q-item-label>
    </template> -->
  </q-tel-input>
</template>

<script setup lang="ts">
  import { useField } from "vee-validate";
  import QTelInput from "vue3-q-tel-input";

  const props = defineProps({
    name: {
      type: String,
      required: true
    },
    inputType: {
      type: String as PropType<any> | undefined,
      default: "text"
    },
    defaultIso: {
      type: String,
      default: "HK"
    }
  });

  const { errorMessage, value: untypedValue } = useField(() => props.name);
  const value = untypedValue as Ref<string | number | null>;
  const country = ref();

  const selectedCountry = (newValue: any) => {
    country.value = newValue;
  };

  const options = {
    showFlags: false,
    showSearchBox: true
  };
</script>

<style>
  .v3-q-tel-input--country {
    .q-field__control {
      background: none !important;
      &::before {
        display: none !important;
      }
    }
    .q-field__input {
      border: none !important;
    }
  }
  .v3-q-tel--country-selector {
    position: sticky !important;
    bottom: 0 !important;
    left: 0 !important;
    right: 0 !important;
  }

  .vue3-q-tel-input {
    &.no-inherit-feedback,
    .no-inherit-feedback {
      &.q-field--highlighted {
        .q-field__inner {
          .q-field__inner {
            .q-field__control {
              &::after {
                display: none;
              }
            }
          }
        }
      }
    }

    &.no-feedback,
    .no-feedback {
      .q-field__control {
        &::after {
          display: none;
        }
      }
    }
  }
</style>
