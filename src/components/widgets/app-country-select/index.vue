<template>
  <q-input
    map-options
    emit-value
    stack-label
    standout="bg-grey-7 text-white"
    :error="has_error"
    v-model="phoneNumber"
    :dark="false"
    :error-message="errorMessage"
    class="vue3-q-tel-input no-inherit-feedback"
    :maxlength="prev_value.length"
    v-bind="$props"
  >
    <template #prepend>
      <CountrySelection
        :use-icon="useIcon"
        :label="labelText"
        :search-text="searchText"
        :search-icon="searchIcon"
        v-model:country="country"
        :readonly="readonly"
        :disable="disable"
        :dense="dense"
        :no-results-text="noResultsText"
        v-bind="dropdownOptions"
        class="no-border-field-before no-padding-field font-reduced-input-adon"
      >
        <template v-for="slot of countrySelectSlots" v-slot:[slot]="scope">
          <slot :name="slot" v-bind="scope ?? {}"></slot>
        </template>
      </CountrySelection>
    </template>
    <template v-for="slot of inputSlots" v-slot:[slot]="scope">
      <slot :name="slot" v-bind="scope ?? {}"></slot>
    </template>
  </q-input>
</template>

<script setup lang="ts">
  import { ref, Ref, computed, ComputedRef, onMounted, useSlots, nextTick, watch } from "vue";
  import CountrySelection from "./country-selection.vue";
  import { Country } from "@/interfaces/models/entities/country-code";

  import { getCountryByDialCode, getDefault } from "./countries";
  import { QInput } from "quasar";
  import { useField } from "vee-validate";

  const props = defineProps({
    name: {
      type: String,
      required: true
    },
    tel: { type: [String, Number], default: () => "" },
    required: { type: Boolean, default: () => false },
    searchText: { type: String, default: () => "Search" },
    searchIcon: { type: String, default: () => "search" },
    dropdownOptions: { type: Object, default: () => ({}) },
    noResultsText: { type: String, default: () => "No results found" },
    defaultCountry: { type: String, default: () => "us" },
    eagerValidate: { type: Boolean, default: () => true },
    useIcon: { type: Boolean, default: () => false },
    readonly: { type: Boolean, default: () => false },
    dense: { type: Boolean, default: () => false },
    disable: { type: Boolean, default: () => false },
    disableAutoCountrySelection: { type: Boolean, default: () => false },
    labelText: { type: String, default: () => "" }
  });

  const country = ref(getDefault() as Country) as Ref<Country>;
  const old_country = ref(undefined) as Ref<Country | undefined>;

  const has_error = ref(false) as Ref<boolean>;
  const prev_value = ref("01234567890123456789") as Ref<string>;

  const { errorMessage, value: untypedValue } = useField(() => props.name);
  const value = untypedValue as Ref<string | number | null>;
  const phoneNumber = ref(value.value);

  const inputSlots: ComputedRef<string[]> = computed(() =>
    Object.keys(useSlots).filter(slotName => !slotName.startsWith("cs-"))
  );
  const countrySelectSlots: ComputedRef<string[]> = computed(() =>
    Object.keys(useSlots)
      .filter(slotName => slotName.startsWith("cs-"))
      .map(slotName => slotName.substring(3))
  );

  onMounted(() => {
    country.value = getCountryByDialCode(props.defaultCountry) as Country;
  });

  watch(
    () => props.defaultCountry,
    () => {
      if (props.defaultCountry) {
        country.value = getCountryByDialCode(props.defaultCountry) as Country;
      }
    },
    { immediate: true }
  );

  watch(
    () => value.value, // Watch the original value
    (newVal, oldVal) => {
      if (newVal != oldVal) {
        if (newVal != null && newVal.toString().startsWith("+")) {
          phoneNumber.value = newVal.toString().replace(/^(\+\d+\s+)/, "");
        } else {
          phoneNumber.value = newVal;
        }
      }
    },
    { deep: true }
  );

  watch(
    () => country.value,
    () => {
      nextTick(() => {
        old_country.value = country.value;
        value.value = `+${country.value.dialCode} ${phoneNumber.value ?? ""}`;
      });
    },
    { immediate: true }
  );

  watch(
    () => phoneNumber.value,
    (newVal, oldVal) => {
      if (newVal != oldVal) {
        nextTick(() => {
          if (country) value.value = `+${country.value.dialCode} ${newVal}`;
        });
      }
    },
    { deep: true }
  );
</script>

<style lang="scss">
  @import "../../../css/style";
</style>
