<template>
  <q-toolbar style="max-width: 800px">
    <custom-search-input v-model="keyword" @search="handleSearch" />
  </q-toolbar>
</template>

<script setup lang="ts">
  // Vue Import
  import { ref } from "vue";

  // Custom Components
  import CustomSearchInput from "@/components/custom/custom-search-input.vue";

  const emit = defineEmits(["on-search"]);

  const keyword = ref("");

  function handleSearch() {
    emit("on-search", keyword.value);
  }
</script>
