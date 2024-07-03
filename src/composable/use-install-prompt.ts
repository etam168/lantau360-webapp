import { Dialog, Notify } from "quasar";
import InstallEdgeDialog from "@/components/dialog/install-edge-dialog.vue";
import InstallIosDialog from "@/components/dialog/install-ios-dialog.vue";
import InstallOperaDialog from "@/components/dialog/install-opera-dialog.vue";
import InstallCompleteDialog from "@/components/dialog/install-complete-dialog.vue";
import i18n from "@/plugins/i18n/i18n";
const { notify } = useUtilities();

const beforeInstallPromptEvent = ref();
const isAppInstalled = ref(false);
const showAppInstallButton = ref(false);
const userAgent = window.navigator.userAgent;

export function useInstallPrompt() {
  const appInstalledPrompt = () => {
    Dialog.create({
      component: InstallCompleteDialog
    });
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
          notify("User accepted the install prompt", "negative");
        } else {
          notify("User dismissed the install prompt", "negative");
        }
        beforeInstallPromptEvent.value = null;
      });
    }
  };

  function shouldShowInstallButton() {
    const result =
      !isAppInstalled.value &&
      !isInStandaloneMode() &&
      (platform.isIos() || platform.isOpera() || platform.isEdge() || platform.isChromium());

    return result;
  }

  function showPlatformGuidance() {
    switch (true) {
      case platform.isIos():
        Dialog.create({
          component: InstallIosDialog
        });
        break;
      case platform.isOpera():
        Dialog.create({
          component: InstallOperaDialog
        });
        break;
      case platform.isEdge():
        Dialog.create({
          component: InstallEdgeDialog
        });
        break;
      default:
      //   // To be impemented: Handle unknown browsers with a generic message or action
    }
  }

  return {
    appInstalledPrompt,
    beforeInstallPromptEvent,
    isAppInstalled,
    isInStandaloneMode,
    notifyNativeInstall,
    platform,
    promptInstall,
    shouldShowInstallButton,
    showAppInstallButton,
    showPlatformGuidance
  };
}
