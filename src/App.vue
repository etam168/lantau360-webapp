<template>
  <router-view />
</template>

<script setup lang="ts">
  const $q = useQuasar();
  const {
    appInstalledPrompt,
    beforeInstallPromptEvent,
    isAppInstalled,
    isInStandaloneMode,
    notifyNativeInstall,
    platform,
    showPlatformGuidance
  } = useInstallPrompt();

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
    if (!isInStandaloneMode()) {
      switch (true) {
        case platform.isChromium():
          window.addEventListener("beforeinstallprompt", handleBeforeinstallprompt);
          break;
        case platform.isEdge():
        case platform.isIos():
        case platform.isOpera():
          showGuidance();
          break;
        case platform.isFireFox():
          break;
        default:
        //   // To be impemented: Handle unknown browsers with a generic message or action
      }
    }

    window.addEventListener("appinstalled", () => {
      isAppInstalled.value = true;
      appInstalledPrompt();
    });
  });
</script>
