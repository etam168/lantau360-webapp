import { Dialog, Notify } from "quasar";
import installEdgeDialog from "@/components/dialog/install-edge-dialog.vue";
import installFirefoxDialog from "@/components/dialog/install-firefox-dialog.vue";
import installIosDialog from "@/components/dialog/install-ios-dialog.vue";
import InstallOperaDialog from "@/components/dialog/install-opera-dialog.vue";
import i18n from "@/plugins/i18n/i18n";

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
    const { t } = i18n.global;

    Notify.create({
      message: t("notification.installApp") + " ?",
      color: "primary",
      timeout: 10000,
      actions: [
        {
          label: t("notification.dismiss"),
          color: "white"
        },
        {
          label: t("notification.install"),
          color: "white",
          handler: () => {
            promptInstall();
          }
        }
      ]
    });
  };

  const platform = {
    isAndroid: () => /android/.test(userAgent.toLowerCase()),
    isChromium: () => {
      // Check for Chromium-specific keywords in the user agent string
      const ua = userAgent.toLowerCase();

      return (
        ua.includes("chrome") && !ua.includes("edg") && !ua.includes("opr") && !ua.includes("brave")
      );
    },
    isEdge: () => /edg/i.test(userAgent.toLowerCase()),
    isFireFox: () => /Firefox/i.test(userAgent),
    isIos: () => /iphone|ipad|ipod/i.test(userAgent.toLowerCase()),
    isOpera: () => /opr/i.test(userAgent.toLowerCase()),
    isSamsung: () => /Samsung/i.test(userAgent.toLowerCase())
  };

  const promptInstall = () => {
    if (beforeInstallPromptEvent.value) {
      beforeInstallPromptEvent.value.prompt();
      beforeInstallPromptEvent.value.userChoice.then((choiceResult: any) => {
        if (choiceResult.outcome === "accepted") {
          console.log("User accepted the install prompt");
        } else {
          console.log("User dismissed the install prompt");
        }
        beforeInstallPromptEvent.value = null;
      });
    }
  };

  function setDeferredPrompt(event: any) {
    beforeInstallPromptEvent.value = event;
    isAppInstalled.value = false;
  }

  function shouldShowInstallButton() {
    return (
      !isAppInstalled.value &&
      !isInStandaloneMode() &&
      (platform.isIos() ||
        platform.isFireFox() ||
        platform.isOpera() ||
        platform.isEdge() ||
        platform.isChromium())
    );
  }

  function showPlatformGuidance() {
    switch (true) {
      case platform.isIos():
        Dialog.create({
          component: installIosDialog
        });
        break;
      case platform.isFireFox():
        Dialog.create({
          component: installFirefoxDialog
        });
        break;
      case platform.isOpera():
        Dialog.create({
          component: InstallOperaDialog
        });
        break;
      case platform.isEdge():
        Dialog.create({
          component: installEdgeDialog
        });
        break;
      default:
      //   // To be impemented: Handle unknown browsers with a generic message or action
    }
  }

  return {
    beforeInstallPromptEvent,
    hasAppInstalled,
    isAppInstalled,
    isInStandaloneMode,
    notifyNativeInstall,
    platform,
    promptInstall,
    setDeferredPrompt,
    shouldShowInstallButton,
    showAppInstallButton,
    showPlatformGuidance
  };
}
