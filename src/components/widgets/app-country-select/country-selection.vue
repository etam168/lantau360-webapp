<template>
  <q-select
    v-model="selectedCountry"
    :options="countryOptions"
    :option-disable="isDisabled"
    hide-bottom-space
    hide-dropdown-icon
    borderless
    virtual-scroll-slice-size="9999"
    class="no-inherit-feedback no-feedback v3-q-tel-input--country"
    @update:model-value="countryChanged"
    @popup-hide="search_text = ''"
    :menu-offset="[12, 0]"
    v-bind="$props"
  >
    <template v-slot:option="scope">
      <div class="flex items-center q-pa-xs mdi-border-bottom no-wrap" v-bind="scope.itemProps">
        <span
          v-if="!!scope.opt.iso2"
          :class="!useIcon ? ['v3q_tel__flag', scope.opt.iso2.toLowerCase()] : 'q-mr-sm'"
          >{{ useIcon ? scope.opt.emoji : "" }}</span
        >
        <span v-if="!!scope.opt.dialCode" class="q-ml-sm text-no-wrap"
          >(+{{ scope.opt.dialCode }})</span
        >
        <span
          :class="[
            'q-ml-sm text-no-wrap ellipsis',
            { 'disabled full-width text-center': scope.opt.disabled }
          ]"
          >{{ scope.opt.name }}</span
        >
      </div>
      <q-separator />
    </template>
    <template v-slot:selected-item="scope">
      <div class="q-pa-none ellipsis" v-if="scope.opt" style="min-height: unset">
        <div class="flex items-center no-wrap">
          <span
            :class="!useIcon ? ['v3q_tel__flag q-mr-sm', scope.opt.iso2.toLowerCase()] : 'q-mr-sm'"
            >{{ useIcon ? scope.opt.emoji : "" }}</span
          >
          <span class="ellipsis text-no-wrap" v-html="`+${scope.opt.dialCode}`"></span>
        </div>
      </div>
    </template>
    <template v-slot:after-options>
      <div class="v3-q-tel--country-selector last-search-item q-pa-sm">
        <q-input
          v-model="search_text"
          ref="input"
          @update:model-value="performSearch"
          dense
          outlined
          :label="searchText"
          class="bg-white"
        >
          <template v-slot:prepend>
            <q-icon :name="searchIcon ?? 'search'" />
          </template>
        </q-input>
      </div>
    </template>
    <template v-for="(_, slot) in $slots" v-slot:[slot]="scope">
      <slot :name="slot" v-bind="scope ?? {}"></slot>
    </template>
  </q-select>
</template>

<script setup lang="ts">
  import { PropType, Ref, ref, onMounted, watch } from "vue";
  import countries, { filterCountries } from "./countries";
  import { Country } from "@/interfaces/models/entities/country-code";

  type CountryOption = Country & { disabled?: boolean };

  const props = defineProps({
    country: { type: Object as PropType<Country>, required: true },
    searchText: { type: String, default: () => "Search" },
    searchIcon: { type: String, default: () => "search" },
    noResultsText: { type: String, default: () => "No results found" },
    useIcon: { type: Boolean, default: () => false }
  });

  const emits = defineEmits(["countryChanged", "update:country"]);

  const search_text = ref("") as Ref<string>;
  const countryOptions = ref([]) as Ref<CountryOption[]>;
  const selectedCountry = ref(props.country);

  onMounted(() => {
    countryOptions.value = [...countries];
  });

  function performSearch() {
    const needle = search_text.value.toLowerCase().trim();
    const newCountries: CountryOption[] = needle === "" ? [...countries] : filterCountries(needle);
    if (newCountries.length === 0)
      newCountries.push({
        name: props.noResultsText,
        dialCode: "",
        iso2: "",
        disabled: true
      });
    countryOptions.value.splice(0, countryOptions.value.length, ...newCountries);
  }
  function countryChanged(val: Country) {
    emits("update:country", val);
    emits("countryChanged", val);
  }

  function isDisabled(option: unknown) {
    if (typeof option === "string") {
      return false;
    }
    return !!(option as CountryOption).disabled;
  }

  watch(
    () => props.country,
    newCountry => {
      selectedCountry.value = newCountry;
      search_text.value = "";
      performSearch();
    },
    { immediate: true }
  );

  watch(selectedCountry, newSelectedCountry => {
    emits("update:country", newSelectedCountry);
  });
</script>

<style lang="scss">
  @import "../../../css/flags.css";
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
</style>
