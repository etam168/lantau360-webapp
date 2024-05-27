<template>
  <router-view />
  <!-- <q-btn @click="promptInstall">Install app</q-btn> -->
</template>

<script setup lang="ts">
  import { ref, onMounted } from "vue";
  import { useQuasar } from "quasar";
  import InstallIosDialog from "@/components/dialog/install-ios-dialog.vue";
  import { useInstallPrompt } from "@/composable/use-install-prompt";
  // import { useRegisterSW } from "vite-plugin-pwa/vue";

  // const { eventBus } = useUtilities();
  const $q = useQuasar();
  const showInstallButton = ref(false);
  const { deferredPrompt, isAppInstalled, promptInstall } = useInstallPrompt();

  // const isAndroid = () => /android/.test(window.navigator.userAgent.toLowerCase());
  const isIos = () => /iphone|ipad|ipod/.test(window.navigator.userAgent.toLowerCase());

  const isInStandaloneMode = () =>
    window.matchMedia("(display-mode: standalone)").matches ||
    ("standalone" in window.navigator && window.navigator.standalone);

  const showInstallIosDialog = () => {
    $q.dialog({
      component: InstallIosDialog
    });
  };

  onMounted(() => {
    if (isInStandaloneMode()) {
      showInstallButton.value = false;
    } else {
      if (isIos()) {
        showInstallIosDialog(); // Show the iOS installation guide dialog
      }
      window.addEventListener("beforeinstallprompt", (e: Event) => {
        e.preventDefault();
        deferredPrompt.value = e;
        // showInstallButton.value = true;
      });
      if (!sessionStorage.getItem("installPromptShown")) {
        $q.notify({
          message: "You can add this app to your home screen.",
          color: "primary",
          timeout: 10000,
          actions: [
            {
              label: "Dismiss",
              color: "white",
              handler: () => {}
            },
            {
              label: "Install",
              color: "white",
              handler: () => {
                promptInstall();
              }
            }
          ]
        });
        sessionStorage.setItem("installPromptShown", "true");
      }
    }

    window.addEventListener("appinstalled", () => {
      console.log("PWA was installed");
      isAppInstalled.value = true;
    });
  });
</script>
