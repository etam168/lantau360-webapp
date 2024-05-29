import { Dialog, Notify } from "quasar";
import InstallIosDialog from "@/components/dialog/install-ios-dialog.vue";

const deferredPrompt = ref();
const beforeInstallPromptEvent = ref();
const isAppInstalled = ref(false);
const showAppInstallButton = ref(false);
const userAgent = window.navigator.userAgent;

export function useInstallPrompt() {
  const hasAppInstalled = () => {
    // Check if app is installed on iOS
    if ("standalone" in window.navigator && (window.navigator as any).standalone) {
      isAppInstalled.value = true;
    }
    // Check if app is installed in other environments
    if (window.matchMedia("(display-mode: standalone)").matches) {
      isAppInstalled.value = true;
    }
  };

  const isInStandaloneMode = () =>
    window.matchMedia("(display-mode: standalone)").matches ||
    ("standalone" in window.navigator && window.navigator.standalone);

  const notifyNativeInstall = () => {
    const { t } = useI18n({ useScope: "global" });
    Notify.create({
      message: t("installPrompt.message"),
      color: "primary",
      timeout: 10000,
      actions: [
        {
          label: t("installPrompt.dismiss"),
          color: "white"
        },
        {
          label: t("installPrompt.install"),
          color: "white",
          handler: () => {
            promptInstall();
          }
        }
      ]
    });
  };

  const platform = {
    isAndroid: () => /android/.test(window.navigator.userAgent.toLowerCase()),
    isChromium: () => {
      // Check for Chromium-specific keywords in the user agent string
      return (
        userAgent.includes("chrome") &&
        !userAgent.includes("edg") &&
        !userAgent.includes("opr") &&
        !userAgent.includes("brave")
      );
    },
    isEdge: () => /edg/i.test(userAgent.toLowerCase()),
    isFireFox: () => /Firefox/i.test(userAgent),
    isIos: () => /iphone|ipad|ipod/i.test(userAgent.toLowerCase()),
    isOpera: () => /opr/i.test(userAgent.toLowerCase()),
    isSamsung: () => /Samsung/i.test(userAgent.toLowerCase())
  };

  const promptInstall = () => {
    if (deferredPrompt.value) {
      deferredPrompt.value.prompt();
      deferredPrompt.value.userChoice.then((choiceResult: any) => {
        if (choiceResult.outcome === "accepted") {
          console.log("User accepted the install prompt");
        } else {
          console.log("User dismissed the install prompt");
        }
        deferredPrompt.value = null;
      });
    }
  };

  function setDeferredPrompt(event: any) {
    deferredPrompt.value = event;
    isAppInstalled.value = false;
  }

  function showPlatformGuidance() {
    Dialog.create({ component: InstallIosDialog });
  }

  return {
    beforeInstallPromptEvent,
    deferredPrompt,
    hasAppInstalled,
    isAppInstalled,
    isInStandaloneMode,
    notifyNativeInstall,
    platform,
    promptInstall,
    setDeferredPrompt,
    showAppInstallButton,
    showPlatformGuidance
  };
}
