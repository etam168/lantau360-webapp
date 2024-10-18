<!-- InstallButton.vue -->
<template>
  <q-card-section v-if="shouldShowInstallButton()" class="q-pt-none">
    <q-btn rounded class="bg-primary text-white" @click="installApp">
      {{ $t("notification.installApp") }}
    </q-btn>
  </q-card-section>
</template>

<script setup lang="ts">
  import { Platform } from "quasar";
  

  const { isInStandaloneMode, promptInstall, shouldShowInstallButton, showPlatformGuidance } =
  usePwaInstallService();

  function installApp() {
    if (!isInStandaloneMode()) {
      switch (true) {
        case Platform.is.ios:
        case Platform.is.firefox:
        case Platform.is.opera:
        case Platform.is.edge:
          showPlatformGuidance();
          break;
        case Platform.is.chrome:
          promptInstall();
          break;
        default:
        //   // To be impemented: Handle unknown browsers with a generic message or action
      }
    }
  }
</script>

<style scoped>
  /* Add any component-specific styles here */
</style>
