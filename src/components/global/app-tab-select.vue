<template>
  <q-toolbar class="text-white bg-grey-3">
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
  import { PropType } from "vue";
  import { TabItem } from "@/interfaces/tab-item"; // Ensure this path is correct

  // Define the props the component takes with types and required fields
  defineProps({
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

<style>
  /* Add any styles specific to your toolbar here */
</style>
