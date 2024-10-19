import { Dialog, Notify } from "quasar";
import i18n from "@/plugins/i18n/i18n";
import { Platform } from "quasar";

const beforeInstallPromptEvent = ref();
const isAppInstalled = ref(false);
const showAppInstallButton = ref(false);
const userAgent = window.navigator.userAgent;

export function usePwaInstallService() {
  // const appInstalledPrompt = () => {
  //   Dialog.create({
  //     component: InstallCompleteDialog
  //   });
  // };

  const isPWAInstallSupported = () => {
    return "BeforeInstallPromptEvent" in window;
  };

  const isStandaloneModeSupported = () => {
    return "standalone" in window.navigator || "standalone" in (window.navigator as any);
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

  const promptInstall = () => {
    if (beforeInstallPromptEvent.value) {
      beforeInstallPromptEvent.value.prompt();
      beforeInstallPromptEvent.value.userChoice.then((choiceResult: any) => {
        if (choiceResult.outcome === "accepted") {
          // console.log("User accepted the install prompt");
        } else {
          // console.log("User dismissed the install prompt");
        }
        beforeInstallPromptEvent.value = null;
      });
    }
  };

  function shouldShowInstallButton() {
    const result =
      !isAppInstalled.value &&
      !isInStandaloneMode() &&
      (Platform.is.ios || Platform.is.opera || Platform.is.edge || Platform.is.chrome);

    return result;
  }

  function showPlatformGuidance() {
    Dialog.create({
      component: defineAsyncComponent(
        () => import("@/components/dialog/install-items-dialog/index.vue")
      )
    });
  }

  async function checkInstalledRelatedApps() {
    debugger;
    alert("Ds");
    if ("getInstalledRelatedApps" in navigator) {
      alert("inside");

      const relatedApps = await navigator.getInstalledRelatedApps;

      debugger;
      // isAppInstalled.value = relatedApps.length > 0; // Check if any related apps are installed
    }
  }

  return {
    // appInstalledPrompt,
    beforeInstallPromptEvent,
    isAppInstalled,
    isInStandaloneMode,
    isStandaloneModeSupported,
    isPWAInstallSupported,
    notifyNativeInstall,
    promptInstall,
    shouldShowInstallButton,
    showAppInstallButton,
    showPlatformGuidance,
    checkInstalledRelatedApps
  };
}
