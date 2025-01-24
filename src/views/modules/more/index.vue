<template>
  <q-page>
    <app-page-title :title="$t(`${i18nKey}.title`)"></app-page-title>

    <main-content :i18nKey class="q-mt-xs"/>
  </q-page>
</template>

<script setup lang="ts">
  // Custom Components
  import MainContent from "./components/main-content.vue";

  const i18nKey = "more";
</script>
