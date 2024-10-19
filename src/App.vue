<template>
  <router-view />
</template>

<script setup lang="ts">
  const $q = useQuasar();
  import { Platform } from "quasar";

  const {
    // appInstalledPrompt,
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
          case Platform.is.edge:
          case Platform.is.ios:
          case Platform.is.opera:
            showGuidance();
            break;
          default:
          //   // To be impemented: Handle unknown browsers with a generic message or action
        }
      } else {
        showGuidance();
      }
    }

    window.addEventListener("appinstalled", () => {
      isAppInstalled.value = true;
      showPlatformGuidance();
    });
  });
</script>
