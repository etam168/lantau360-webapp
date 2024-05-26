<template>
  <router-view />
</template>

<script setup lang="ts">
  import { ref, onMounted } from "vue";
  import { useQuasar } from "quasar";
  import InstallIosDialog from "@/components/dialog/install-ios-dialog.vue";
  import InstallAndroidDialog from "@/components/dialog/install-android-dialog.vue";

  const $q = useQuasar();

  const showIosInstallPrompt = ref(false);
  const showAndroidInstallPrompt = ref(false);
  let deferredPrompt: any = null;

  const isIos = () => /iphone|ipad|ipod/.test(window.navigator.userAgent.toLowerCase());
  const isAndroid = () => /android/.test(window.navigator.userAgent.toLowerCase());
  const isInStandaloneMode = () =>
    window.matchMedia("(display-mode: standalone)").matches ||
    ("standalone" in window.navigator && window.navigator.standalone);

  const showIosInstallationGuide = () => {
    $q.dialog({
      component: InstallIosDialog
    });
  };

  const showAndroidInstallPromptDialog = (deferredPrompt: any) => {
    $q.dialog({
      component: InstallAndroidDialog,
      componentProps: { deferredPrompt }
    });
  };

  onMounted(() => {
    if (isInStandaloneMode()) {
      showIosInstallPrompt.value = false;
      showAndroidInstallPrompt.value = false;
    } else {
      if (isIos()) {
        showIosInstallPrompt.value = true;
        showIosInstallationGuide();
      }
      window.addEventListener("beforeinstallprompt", (e: Event) => {
        e.preventDefault();
        deferredPrompt = e;
        if (isAndroid()) {
          setTimeout(() => {
            showAndroidInstallPrompt.value = true;
            showAndroidInstallPromptDialog(deferredPrompt);
          }, 10000);
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
