<template>
  <q-field :borderless="true" :error="!!errorMessage" :error-message="errorMessage">
    <q-option-group v-model="value" :options="options" v-bind="$attrs" color="primary" inline dense>
      <template #label="opt">
        <div style="color: black" class="row items-center q-pr-sm q-py-sm">
          <!-- <span>{{ translateFeatures(opt.label, opt.meta, "amenityName") }}</span> -->
          {{ opt.label }}
        </div>
      </template>
    </q-option-group>
  </q-field>
</template>

<script setup lang="ts">
  // Vue Import
  import { useField } from "vee-validate";

  // .ts file
  //import { translateFeatures } from "@/composable/use-search-bar-options";

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
</script>
