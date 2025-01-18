<template>
  <q-card flat square tile class="mx-auto mt-8 mb-2 pb-8 row justify-center">
    <q-layout
      view="lHh lpr lFf"
      container
      style="height: 100vh; max-width: 1024px"
      class="shadow-2 rounded-borders"
    >
      <q-page-container style="min-height: calc(100vh - 163px)">
        <!-- <router-view></router-view> -->
        <router-view :key="$route.fullPath"></router-view>
      </q-page-container>
      <footer-component />
    </q-layout>
  </q-card>
</template>

<script setup lang="ts">
  import FooterComponent from "./footer.vue";
</script>
