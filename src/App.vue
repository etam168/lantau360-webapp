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
    platform,
    notifyNativeInstall,
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
        case platform.isIos():
        case platform.isOpera():
        case platform.isEdge():
          showGuidance();
          break;
        case platform.isChromium():
          window.addEventListener("beforeinstallprompt", handleBeforeinstallprompt);
          break;
        case platform.isFireFox():
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
