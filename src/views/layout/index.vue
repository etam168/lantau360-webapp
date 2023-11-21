<template>
  <q-layout view="lHh lpr lFf" container style="height: 100vh" class="shadow-2 rounded-borders">
    <header-component />
    <q-page-container style="min-height: calc(100vh - 163px)">
      <router-view :key="$route.fullPath"></router-view>
    </q-page-container>
    <footer-content />
  </q-layout>
</template>

<script setup lang="ts">
  // Vue Import
  //import { useUserStore } from "@/stores/user";
  import HeaderComponent from "./header/index.vue";
  import FooterContent from "./footer-and-content/index.vue";
</script>
