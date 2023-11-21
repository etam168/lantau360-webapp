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
  // import { Ref } from "vue";

  // .ts files
  import { useField } from "vee-validate";
  import { ref, watch } from "vue";
  const listingMode = ref<any>([1]);

  const props = defineProps({
    name: {
      type: String,
      required: true
    }
  });

  const { errorMessage, value } = useField(() => props.name);
  watch(
    () => value.value,
    _modeValue => {
      listingMode.value = ListingModes.filter(
        lm => (lm.value & (_modeValue as number)) === lm.value
      ).map(lm => lm.value);
    }
  );

  const ListingModes = [
    {
      label: "Rent",
      value: 1
    },
    {
      label: "Buy",
      value: 2
    },
    {
      label: "Feature",
      value: 4
    },
    {
      label: "Front Page",
      value: 8
    },
    {
      label: "Sole Agent",
      value: 16
    }
  ];
  function modelValueUpdate(selectedItem: number[]) {
    let sum = 0;
    sum = selectedItem.reduce((acc, optionValue) => acc + optionValue, 0);
    value.value = sum;
  }
</script>
