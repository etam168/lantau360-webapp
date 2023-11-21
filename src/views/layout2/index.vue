<template>
  <q-layout view="hHh lpR fFf">
    <AppHeader @on-click="toggleDrawer" />
    <Drawer />

    <q-page-container>
      <!-- <router-view></router-view> -->
      <router-view :key="$route.fullPath"></router-view>
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
  import eventBus from "@/utils/event-bus";

  // Custom Components
  import AppHeader from "./header.vue";
  import Drawer from "./drawer/index.vue";

  const toggleDrawer = () => {
    eventBus.emit("toggle-drawer");
  };
</script>
