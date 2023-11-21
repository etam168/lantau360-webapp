<template>
  <q-field :borderless="true" :error="!!errorMessage" :error-message="errorMessage">
    <q-option-group
      v-model="selectedValues"
      :options="options"
      color="green"
      type="checkbox"
      v-bind="$attrs"
      :disable="isDisable"
      dense
      @update:model-value="onSelectionUpdate"
    >
      <template #label="opt">
        <div class="row items-center q-py-sm text-black">
          <span v-if="isTranslated">{{ opt.label }}</span>
          <span v-else>{{ translateFeatures(opt.label, opt.meta, localeField) }}</span>
        </div>
      </template>
    </q-option-group>
  </q-field>
</template>

<script setup lang="ts">
  // Vue Import
  import { ref, watch } from "vue";
  import { useField } from "vee-validate";

  // .ts file
  import { translateFeatures } from "@/composable/use-search-bar-options";

  const props = defineProps({
    name: {
      type: String,
      required: true
    },
    options: {
      type: Array<any>,
      required: true
    },
    localeField: {
      type: String,
      default: "amenityName"
    },
    isTranslated: {
      type: Boolean,
      default: false
    },
    isDisable: {
      type: Boolean,
      default: false
    }
  });

  const { errorMessage, value } = useField(props.name);
  const selectedValues = ref<any>([]);

  watch(value, newValue => {
    selectedValues.value = newValue || [];
  });

  function onSelectionUpdate(selectedItem: any) {
    value.value = selectedItem;
  }
</script>
