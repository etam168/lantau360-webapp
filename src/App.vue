<template>
  <router-view />
</template>

<script setup lang="ts">
  import { ref, onMounted } from "vue";
  import { useQuasar } from "quasar";
  //import InstallAndroidDialog from "@/components/dialog/install-android-dialog.vue";
  import InstallIosDialog from "@/components/dialog/install-ios-dialog.vue";
  import { useInstallPrompt, platform } from "@/composable/use-install-prompt";
  // import { useRegisterSW } from "vite-plugin-pwa/vue";

  // const { eventBus } = useUtilities();
  const $q = useQuasar();
  const showInstallButton = ref(false);
  const { deferredPrompt, isAppInstalled, promptInstall } = useInstallPrompt();

  // const isAndroid = () => /android/.test(window.navigator.userAgent.toLowerCase());

  const isInStandaloneMode = () =>
    window.matchMedia("(display-mode: standalone)").matches ||
    ("standalone" in window.navigator && window.navigator.standalone);

  const showInstallIosDialog = () => {
    $q.dialog({
      component: InstallIosDialog
    });
  };

  // const showInstallAndroidDialog = () => {
  //   $q.dialog({
  //     component: InstallAndroidDialog,
  //     componentProps: {
  //       deferredPrompt: deferredPrompt.value
  //     }
  //   });
  // };

  const notifyPrompt = () => {
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
  };

  onMounted(() => {
    if (isInStandaloneMode()) {
      showInstallButton.value = false;
    } else {
      if (platform.isIos()) {
        showInstallIosDialog(); // Show the iOS installation guide dialog
      } else if (platform.isFireFox() || platform.isOpera() || platform.isEdge()) {
        showInstallIosDialog();
      } else {
        window.addEventListener("beforeinstallprompt", (e: Event) => {
          e.preventDefault();
          deferredPrompt.value = e;
        });
        if (!sessionStorage.getItem("installPromptShown")) {
          //Notify Message
          notifyPrompt();
          sessionStorage.setItem("installPromptShown", "true");
        }
      }
    }

    window.addEventListener("appinstalled", () => {
      console.log("PWA was installed");
      isAppInstalled.value = true;
    });
  });
</script>
