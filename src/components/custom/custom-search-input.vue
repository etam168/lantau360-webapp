<!-- custom-search-input.vue -->
<template>
  <q-input
    v-bind="$attrs"
    :model-value="modelValue"
    :placeholder="$t('home.searchBar.placeholder')"
    class="q-pl-md bg-grey-3 full-width"
    borderless
    input-class="text-left"
    style="overflow: hidden; border-radius: 24px"
    hide-bottom-space
    @update:model-value="updateModelValue"
  >
    <template v-slot:append>
      <q-btn v-if="modelValue" icon="clear" flat round dense @click="clearInput" />
    </template>

    <template v-slot:after>
      <q-btn square unelevated size="lg" padding="md 8px" color="primary" @click="$emit('search')">
        <q-icon size="sm" name="search" />
      </q-btn>
    </template>
  </q-input>
</template>

<script setup lang="ts">
  defineProps({
    modelValue: String
  });

  const emit = defineEmits(["update:modelValue", "search"]);

  const updateModelValue = (value: any) => {
    emit("update:modelValue", value);
  };

  const clearInput = () => {
    emit("update:modelValue", "");
  };
</script>
