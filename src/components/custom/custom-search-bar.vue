<template>
  <q-responsive full-width style="height: 48px" class="q-my-md">
    <q-toolbar>
      <custom-search-input v-model="keyword" @search="handleSearch" />
    </q-toolbar>
  </q-responsive>
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
