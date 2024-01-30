<!-- app-search-bar.vue -->
<template>
  <q-toolbar style="max-width: 800px">
    <q-input
      v-bind="$attrs"
      :model-value="keyword"
      :placeholder="$t('home.searchBar.placeholder')"
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
        <q-btn v-if="keyword" icon="clear" flat round dense @click="clearInput" />
      </template>

      <template v-slot:after>
        <q-btn square unelevated padding="md 18px" color="primary" @click="handleSearch">
          <q-icon size="sm" name="search" />
        </q-btn>
      </template>
    </q-input>
  </q-toolbar>
</template>

<script setup lang="ts">
  const { notify } = useUtilities();

  const emit = defineEmits(["on-search"]);
  const props = defineProps({
    query: {
      type: String,
      required: false,
      default: ""
    }
  });

  const keyword = ref(props.query);

  function handleSearch() {
    if (keyword.value.length < 3) {
      notify("Minimum 3 letters are required", "negative");
      return;
    }
    emit("on-search", keyword.value);
  }

  const updateModelValue = (value: any) => {
    keyword.value = value;
  };

  const clearInput = () => {
    keyword.value = "";
  };

  const handleEnterKey = (event: KeyboardEvent) => {
    if (event.key === "Enter") {
      handleSearch();
    }
  };
</script>
