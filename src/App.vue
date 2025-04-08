<template>
  <router-view />
</template>

<script setup lang="ts">
  import { Platform } from "quasar";
  import { useTitle, useFavicon } from "@vueuse/core";

  const $q = useQuasar();

  // Import VueUse hooks
  useTitle("Lantau360 Lite");
  useFavicon("/favicon.ico");

  $q.addressbarColor.set("#478d45");

  const {
    beforeInstallPromptEvent,
    isAppInstalled,
    isPWAInstallSupported,
    isInStandaloneMode,
    isStandaloneModeSupported,
    notifyNativeInstall,
    showPlatformGuidance
  } = usePwaInstallService();

  function handleBeforeinstallprompt(event: Event) {
    event.preventDefault();
    beforeInstallPromptEvent.value = event;

    if (!$q.sessionStorage.getItem("hasNotifiedNativeInstall")) {
      notifyNativeInstall();
      $q.sessionStorage.setItem("hasNotifiedNativeInstall", "true");
    }
  }

  function showGuidance() {
    if (!$q.sessionStorage.getItem("hasShownGuidance")) {
      showPlatformGuidance();
      $q.sessionStorage.setItem("hasShownGuidance", "true");
    }
  }

  onMounted(() => {
    if (!isStandaloneModeSupported() || !isInStandaloneMode()) {
      if (isPWAInstallSupported()) {
        switch (true) {
          case Platform.is.chrome:
            window.addEventListener("beforeinstallprompt", handleBeforeinstallprompt);
            break;
          default:
          //   // To be impemented: Handle unknown browsers with a generic message or action
        }
      } else {
        switch (true) {
          case Platform.is.edge:
          case Platform.is.ios:
          case Platform.is.opera:
            showGuidance();
            break;
          default:
          //Dont need to do anything
        }
      }
    }

    window.addEventListener("appinstalled", () => {
      isAppInstalled.value = true;
      showPlatformGuidance();
    });
  });
</script>

<style lang="scss">
  /*
   * Global fix for password manager auto-fill interference
   * Prevents password managers from applying unwanted background styles
   * that can interfere with the application's input field styling
   */
  input {
    background-clip: text !important;
    -webkit-background-clip: text !important;
  }
</style>
