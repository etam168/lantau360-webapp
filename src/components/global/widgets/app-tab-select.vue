<template>
  <q-toolbar
    v-bind="$attrs"
    class="q-gutter-x-sm q-pl-md"
    :class="$q.screen.lt.sm ? 'flex-wrap' : ''"
  >
    <q-chip
      v-for="(tabItem, index) in tabItems"
      :key="index"
      :outline="currentTab !== tabItem.name"
      color="primary"
      text-color="white"
      clickable
      @click="setTab(tabItem.name)"
    >
      {{ tabItem.label }}
    </q-chip>
  </q-toolbar>
</template>

<script setup lang="ts">
  // Interface files
  import { TabItem } from "@/interfaces/tab-item"; // Ensure this path is correct

  // Props
  const { tabItems, currentTab } = defineProps<{
    tabItems: TabItem[];
    currentTab: String;
  }>();

  // Define the emits the component will make
  const emit = defineEmits(["update:currentTab"]);

  // Method to update the tab, emitting an event for the parent to handle
  const setTab = (val: string) => {
    emit("update:currentTab", val);
  };
</script>

<style>
  .q-toolbar.flex-wrap {
    flex-wrap: wrap !important;
  }
</style>
