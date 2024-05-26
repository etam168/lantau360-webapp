<template>
  <router-view />
  <button v-if="showInstallButton" @click="promptInstall">Install App</button>
</template>

<script setup lang="ts">
  import { ref, onMounted } from "vue";
  import { useQuasar } from "quasar";
  import InstallIosDialog from "@/components/dialog/install-ios-dialog.vue";
  // import { useRegisterSW } from "vite-plugin-pwa/vue";

  const { eventBus } = useUtilities();
  const $q = useQuasar();
  const showInstallButton = ref(false);
  const deferredPrompt = ref();

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

  const promptInstall = () => {
    alert("outside");

    if (deferredPrompt.value) {
      alert("inside");
      deferredPrompt.value.prompt();
      deferredPrompt.value.userChoice.then((choiceResult: any) => {
        if (choiceResult.outcome === "accepted") {
          console.log("User accepted the install prompt");
        } else {
          console.log("User dismissed the install prompt");
        }
        deferredPrompt.value = null;
        showInstallButton.value = false; // Hide the install button after the prompt
      });
    }
  };

  // Register the service worker
  // useRegisterSW();

  onMounted(() => {
    eventBus.on("install", () => {
      alert("EventBus 3");

      promptInstall();
    });

    if (isInStandaloneMode()) {
      showInstallButton.value = false;
    } else {
      if (isIos()) {
        showInstallIosDialog(); // Show the iOS installation guide dialog
      }
      window.addEventListener("beforeinstallprompt", (e: Event) => {
        e.preventDefault();
        deferredPrompt.value = e;
        setTimeout(() => {
          eventBus.emit("install");
        }, 2000);
        showInstallButton.value = true; // Show the install button
      });
    }

    window.addEventListener("appinstalled", () => {
      console.log("PWA was installed");
      showInstallButton.value = false;
    });
  });
</script>
