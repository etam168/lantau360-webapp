<!-- app-search-bar.vue -->
<template>
  <q-toolbar style="max-width: 720px">
    <q-input
      v-bind="$attrs"
      :model-value="keyword"
      :placeholder="$t(`${i18nKey}.searchBar.placeholder`)"
      class="q-pl-md bg-grey-3 full-width"
      borderless
      dense
      input-class="text-left"
      style="overflow: hidden; border-radius: 24px"
      hide-bottom-space
      @keyup.enter="handleEnterKey"
      @update:model-value="updateModelValue"
    >
      <template v-slot:append>
        <q-btn v-if="keyword" :icon="fasXmark" flat round dense @click="clearInput" />
      </template>

      <template v-slot:after>
        <q-btn square unelevated padding="md 18px" color="primary" @click="handleSearch">
          <q-icon size="xs" :name="fasMagnifyingGlass" />
        </q-btn>
      </template>
    </q-input>
  </q-toolbar>
</template>

<script setup lang="ts">
  import { fasXmark, fasMagnifyingGlass } from "@quasar/extras/fontawesome-v6";

  // Emits
  const emit = defineEmits(["on-search", "on-clear-input"]);

  // v-model;
  const keyword = defineModel<string>("keyword", {
    required: false,
    default: ""
  });

  const { notify } = useUtilities();
  const { t } = useI18n({ useScope: "global" });

  const i18nKey = "home";

  function handleSearch() {
    if (keyword.value.length < 3) {
      notify(t("errors.minimum3letter"), "negative");
      return;
    }
    emit("on-search", keyword.value);
  }

  const updateModelValue = (value: any) => {
    keyword.value = value;
  };

  const clearInput = () => {
    keyword.value = "";
    emit("on-clear-input");
  };

  const handleEnterKey = (event: KeyboardEvent) => {
    if (event.key === "Enter") {
      handleSearch();
    }
  };
</script>
