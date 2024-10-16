<template>
  <router-view />
  <q-dialog v-model="showInstallDialog" persistent>
    <q-card style="min-width: 350px">
      <q-card-section>
        <div class="text-h6">Install Our App</div>
      </q-card-section>
      <q-card-section class="q-pt-none">
        {{ installInstructions }}
      </q-card-section>
      <q-card-actions align="right" class="text-primary">
        <q-btn flat label="Cancel" v-close-popup />
        <q-btn flat label="Install" @click="installApp" v-if="beforeInstallPromptEvent" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
  import { ref, onMounted } from "vue";
  import { useQuasar, Platform } from "quasar";
  import { useInstallPrompt } from "./composables/useInstallPrompt"; // Adjust the import path as needed

  const $q = useQuasar();
  const showInstallDialog = ref(false);
  const installInstructions = ref("");

  const {
    appInstalledPrompt,
    beforeInstallPromptEvent,
    isAppInstalled,
    isInStandaloneMode,
    notifyNativeInstall,
    showPlatformGuidance
  } = useInstallPrompt();

  function handleBeforeinstallprompt(event: Event) {
    event.preventDefault();
    beforeInstallPromptEvent.value = event as any;
    showInstallPrompt();
  }

  function showInstallPrompt() {
    if (!$q.sessionStorage.getItem("hasNotifiedInstall")) {
      showInstallDialog.value = true;
      $q.sessionStorage.setItem("hasNotifiedInstall", "true");
    }
  }

  function showGuidance() {
    if (!$q.sessionStorage.getItem("hasShownGuidance")) {
      installInstructions.value = getPlatformInstructions();
      showInstallDialog.value = true;
      $q.sessionStorage.setItem("hasShownGuidance", "true");
    }
  }

  function getPlatformInstructions(): string {
    if (Platform.is.ios) {
      return "To install our app on iOS: Tap the share icon, then 'Add to Home Screen'.";
    } else if (Platform.is.android) {
      return "To install our app on Android: Tap the menu icon, then 'Add to Home Screen'.";
    } else if (Platform.is.firefox) {
      return "To install our app on Firefox: Bookmark this page, then access it from your home screen.";
    } else {
      return "To install our app: Use your browser's 'Add to Home Screen' or 'Install' option from the menu.";
    }
  }

  async function installApp() {
    if (beforeInstallPromptEvent.value) {
      await beforeInstallPromptEvent.value.prompt();
      const choiceResult = await beforeInstallPromptEvent.value.userChoice;
      if (choiceResult.outcome === "accepted") {
        console.log("User accepted the install prompt");
      } else {
        console.log("User dismissed the install prompt");
      }
      beforeInstallPromptEvent.value = null;
    }
    showInstallDialog.value = false;
  }

  function isStandaloneModeSupported(): boolean {
    return "standalone" in window.navigator || "standalone" in (window.navigator as any);
  }

  function isPWAInstallSupported(): boolean {
    return "BeforeInstallPromptEvent" in window;
  }

  onMounted(() => {
    if (!isStandaloneModeSupported() || !isInStandaloneMode()) {
      if (isPWAInstallSupported()) {
        window.addEventListener("beforeinstallprompt", handleBeforeinstallprompt);
        window.addEventListener("appinstalled", () => {
          isAppInstalled.value = true;
          appInstalledPrompt();
        });
      } else {
        showGuidance();
      }
    }
  });
</script>
