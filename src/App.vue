<template>
  <router-view />
</template>

<script setup lang="ts">
  import { useInstallPrompt } from "@/composable/use-install-prompt";

  const {
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

    if (!sessionStorage.getItem("hasNotifyNativeInstall")) {
      notifyNativeInstall();
      sessionStorage.setItem("hasNotifyNativeInstall", "true");
    }
  }

  onMounted(() => {
    if (!isInStandaloneMode()) {
      if (platform.isIos() || platform.isFireFox() || platform.isOpera() || platform.isEdge()) {
        showPlatformGuidance();
      } else if (platform.isChromium()) {
        window.addEventListener("beforeinstallprompt", handleBeforeinstallprompt);
      } else {
        // To be impemented: Handle unknown browsers with a generic message or action
        // console.log("Unknown browser detected, no specific install prompt handling available.");
      }
    }

    window.addEventListener("appinstalled", () => {
      // alert("PWA has installed successfully");
      // console.log("PWA was installed");
      isAppInstalled.value = true;
    });
  });
</script>
