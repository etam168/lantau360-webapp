<!-- more-page-footer.vue -->
<template>
  <q-card-section v-if="$q.screen.height < 700">
    <q-item-label class="text-center">{{ appVersion }}</q-item-label>
    <q-item-label class="text-center">{{ copyright }}</q-item-label>
  </q-card-section>

  <q-page-sticky v-else position="bottom" class="q-pa-sm">
    <q-item-label class="text-center">{{ appVersion }}</q-item-label>
    <q-item-label class="text-center">{{ copyright }}</q-item-label>
  </q-page-sticky>
</template>

<script setup lang="ts">
  import { useQuasar } from "quasar";

  const { t } = useI18n({ useScope: "global" });
  const $q = useQuasar();

  const i18nKey = "more";

  const appVersion = computed(() => t(`${i18nKey}.footer.version`, { version: __APP_VERSION__ }));
  const copyright = computed(() =>
    t(`${i18nKey}.footer.copyright`, { currentYear: new Date().getFullYear() })
  );
</script>

<style scoped>
  /* Add any component-specific styles here */
</style>
