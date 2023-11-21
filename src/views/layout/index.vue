<template>
  <q-layout view="lHh lpr lFf" container style="height: 100vh" class="shadow-2 rounded-borders">
    <header-component />

    <footer-content />
  </q-layout>
</template>

<script setup lang="ts">
  // Vue Import
  //import { useUserStore } from "@/stores/user";
  import HeaderComponent from "./header/index.vue";
  import FooterContent from "./footer-and-content/index.vue";
</script>
