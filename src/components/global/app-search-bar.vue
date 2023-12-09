<!-- custom-search-input.vue -->
<template>
  <q-card-section align="center" class="q-px-xl q-py-sm">
    <q-input
      v-bind="$attrs"
      :model-value="modelValue"
      :placeholder="$t('home.searchBar.placeholder')"
      class="q-pl-md bg-grey-3 full-width"
      input-class="text-left"
      style="overflow: hidden; border-radius: 24px; max-width: 720px"
      borderless
      dense
      hide-bottom-space
      @keyup.enter="handleEnterKey"
      @update:model-value="updateModelValue"
    >
      <template v-slot:append>
        <q-btn v-if="modelValue" icon="clear" flat round dense @click="clearInput" />
      </template>

      <template v-slot:after>
        <q-btn square unelevated padding="md 18px" color="primary" @click="$emit('search')">
          <q-icon size="sm" name="search" />
        </q-btn>
      </template>
    </q-input>
  </q-card-section>
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

  const handleEnterKey = (event: KeyboardEvent) => {
    if (event.key === "Enter") {
      emit("search");
    }
  };
</script>
