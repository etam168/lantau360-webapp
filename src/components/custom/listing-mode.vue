<template>
  <q-field
    borderless
    class="q-pb-none"
    dense
    :error="!!errorMessage"
    :error-message="errorMessage"
    hide-bottom-space
  >
    <q-option-group
      v-model="listingMode"
      :options="ListingModes"
      color="green"
      type="checkbox"
      v-bind="$attrs"
      inline
      @update:model-value="modelValueUpdate"
    />
  </q-field>
</template>

<script setup lang="ts">
  // vue import
  import { ref, inject, Ref, watch } from "vue";

  // .ts files
  import { PropertyInput } from "@/interfaces/input/property-listing-input";
  import { useField } from "vee-validate";

  const props = defineProps({
    name: {
      type: String,
      required: true
    }
  });

  const { errorMessage, value } = useField(props.name);

  const listingMode = ref<any>([]);
  const propertyListingInput = inject("propertyListingInput") as Ref<PropertyInput>;

  watch(value, newValue => {
    listingMode.value = newValue || [];
  });

  const ListingModes = [
    {
      label: "Buy",
      value: 2,
      required: true // Mark as required
    },
    {
      label: "Rent",
      value: 1,
      required: true // Mark as required
    },
    {
      label: "Feature",
      value: 4
    },
    {
      label: "Front Page",
      value: 8
    }
  ];

  function modelValueUpdate(selectedItem: any) {
    value.value = selectedItem;

    // Filter the required options
    const requiredOptions = ListingModes.filter(option => option.required);

    // Check if any of the required options is selected
    const hasRequiredOptionSelected = requiredOptions.some(option =>
      selectedItem.includes(option.value)
    );

    if (!hasRequiredOptionSelected) {
      // If none of the required options are selected, select the first one
      listingMode.value = [requiredOptions[0].value];
    } else {
      listingMode.value = value;
    }

    let sum = 0;
    for (const num of listingMode.value) {
      sum += num;
    }

    propertyListingInput.value.listingMode = sum;
    return propertyListingInput.value.listingMode;
  }
</script>
