<template>
  <router-view />
  <!-- <AddToHomeScreen /> -->
  <div v-show="showIosInstallPrompt" class="install-banner" @click="showIosInstallationGuide">
    {{ $t("installApp.title") }}
  </div>
  <div v-show="showAndroidInstallPrompt" class="install-banner" @click="promptAndroidInstall">
    {{ $t("installApp.title") }}
  </div>
</template>

<script setup lang="ts">
  import { ref, onMounted } from "vue";

  const isIos = () => {
    const userAgent = window.navigator.userAgent.toLowerCase();
    return /iphone|ipad|ipod/.test(userAgent);
  };

  const isAndroid = () => {
    const userAgent = window.navigator.userAgent.toLowerCase();
    return /android/.test(userAgent);
  };

  const isInStandaloneMode = () => {
    return (
      window.matchMedia("(display-mode: standalone)").matches ||
      // For older iOS versions
      ("standalone" in window.navigator && window.navigator.standalone)
    );
  };

  const showIosInstallPrompt = ref(false);
  const showAndroidInstallPrompt = ref(false);
  let deferredPrompt: any = null;

  const showIosInstallationGuide = () => {
    // remove following line if you want to show the banner after installation
    showIosInstallPrompt.value = false;
    alert(
      'To install this app on device:\n\n1. Tap the "Share" button (usually located at the bottom of the screen).\n\n2. Scroll down and find the "Add to Home Screen" option.\n\n3. Tap "Add" in the upper-right corner.\n\nNow, you can access the app from your home screen!'
    );
  };

  const promptAndroidInstall = () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then((choiceResult: any) => {
        if (choiceResult.outcome === "accepted") {
          console.log("User accepted the A2HS prompt");
        } else {
          console.log("User dismissed the A2HS prompt");
        }
        deferredPrompt = null;
        showAndroidInstallPrompt.value = false;
      });
    }
  };

  onMounted(() => {
    if (isInStandaloneMode()) {
      showIosInstallPrompt.value = false;
      showAndroidInstallPrompt.value = false;
    } else {
      if (isIos()) {
        showIosInstallPrompt.value = true;
      }

      window.addEventListener("beforeinstallprompt", (e: Event) => {
        e.preventDefault();
        deferredPrompt = e;
        if (isAndroid()) {
          showAndroidInstallPrompt.value = true;
        }
      });
    }

    window.addEventListener("appinstalled", () => {
      console.log("PWA was installed");
      showIosInstallPrompt.value = false;
      showAndroidInstallPrompt.value = false;
    });
  });
</script>

<style>
  .install-banner {
    position: fixed;
    bottom: 16px;
    right: 16px;
    background-color: #007bff;
    color: #fff;
    padding: 8px 16px;
    border-radius: 8px;
    cursor: pointer;
    font: 12px sans-serif;
  }
</style>
