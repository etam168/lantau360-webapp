<template>
  <q-field :borderless="true" :error="!!errorMessage" :error-message="errorMessage">
    <q-option-group
      v-model="selectedValues"
      :options="options"
      class="q-ma-md"
      color="green"
      type="checkbox"
      v-bind="$attrs"
      @update:model-value="onSelectionUpdate"
    >
      <template #label="opt">
        <div class="row items-center">
          <span>{{ translateFeatures(opt.label, opt.meta, "amenityName") }}</span>
        </div>
      </template>
    </q-option-group>
  </q-field>
</template>

<script setup lang="ts">
  import { useField } from "vee-validate";
  import { ref, watch } from "vue";
  import { useI18n } from "vue-i18n";

  const props = defineProps({
    name: {
      type: String,
      required: true
    },
    options: {
      type: Array<any>,
      required: true
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

  const translateFeatures = (label: string, meta: any, key: string) => {
    const { locale } = useI18n({ useScope: "global" });

    switch (locale.value) {
      case "hk":
        return meta?.hk?.[key] ?? label;
      case "cn":
        return meta?.cn?.[key] ?? label;
      default:
        return label;
    }
  };
</script>
