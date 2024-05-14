<template>
  <q-toolbar v-bind="$attrs" class="q-gutter-x-sm">
    <q-chip
      v-for="(tabItem, index) in props.tabItems"
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

  // Define the props the component takes with types and required fields
  const props = defineProps({
    tabItems: {
      type: Array as PropType<TabItem[]>,
      required: true // If tabItems is required, otherwise you can provide a default value
    },
    currentTab: {
      type: String,
      required: true // If currentTab is required, otherwise you can provide a default value
    }
  });

  // Define the emits the component will make
  const emit = defineEmits(["update:currentTab"]);

  // Method to update the tab, emitting an event for the parent to handle
  const setTab = (val: string) => {
    emit("update:currentTab", val);
  };
</script>

<style scoped>
  .q-toolbar {
    display: flex; /* Use flexbox layout */
    flex-wrap: wrap; /* Allow chips to wrap to the next line */
  }

  .q-chip {
    margin-right: 8px; /* Add some spacing between chips */
    margin-bottom: 8px; /* Add vertical spacing between rows of chips */
  }
</style>
