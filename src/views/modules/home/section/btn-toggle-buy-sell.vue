<!-- btn-toggle-buy-sell.vue -->
<template>
  <q-btn-toggle
    v-bind="$attrs"
    :model-value="modelValue"
    style="min-width: 184px"
    color="grey-6"
    text-color="white"
    toggle-color="primary"
    toggle-text-color="green-1"
    spread
    unelevated
    :options="options"
    @update:model-value="$emit('update:modelValue', $event)"
  >
    <template v-slot:buy>
      <div class="row items-center no-wrap">
        <div class="text-center text-subtitle1">{{ $t("home.searchBar.buy") }}</div>
      </div>
    </template>

    <template v-slot:rent>
      <div class="row items-center no-wrap">
        <div class="text-center text-subtitle1">{{ $t("home.searchBar.rent") }}</div>
      </div>
    </template>
  </q-btn-toggle>
</template>

<script setup lang="ts">
  defineProps({
    modelValue: String
  });

  defineEmits(["update:modelValue"]);

  const options = [
    { value: "buy", slot: "buy" },
    { value: "rent", slot: "rent" }
  ];
</script>
