import { Dialog, Notify } from "quasar";
import i18n from "@/plugins/i18n/i18n";
import { Platform } from "quasar";

const beforeInstallPromptEvent = ref();
const isAppInstalled = ref(!!sessionStorage.getItem("isAppInstalled")); // Check if app is already installed from sessionStorage
const showAppInstallButton = ref(false);

export function usePwaInstallService() {
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
          // App installation accepted, mark it as installed
          isAppInstalled.value = true;
          sessionStorage.setItem("isAppInstalled", "true"); // Persist installation status
        }
        beforeInstallPromptEvent.value = null;
      });
    }
  };

  function shouldShowInstallButton() {
    return (
      !isAppInstalled.value &&
      !isInStandaloneMode() &&
      (Platform.is.ios || Platform.is.opera || Platform.is.edge || Platform.is.chrome)
    );
  }

  function showPlatformGuidance() {
    if (!isAppInstalled.value) {
      Dialog.create({
        component: defineAsyncComponent(
          () => import("@/components/dialog/install-items-dialog/index.vue")
        )
      });
    }
  }

  async function checkInstalledRelatedApps() {
    if ("getInstalledRelatedApps" in navigator) {
      const relatedApps = await navigator.getInstalledRelatedApps;
      // isAppInstalled.value = relatedApps.length > 0; // Check if any related apps are installed
    }
  }

  window.addEventListener("appinstalled", () => {
    isAppInstalled.value = true;
    sessionStorage.setItem("isAppInstalled", "true"); // Persist installation status
  });

  return {
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
