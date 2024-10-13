import { Dialog, Notify } from "quasar";
import InstallEdgeDialog from "@/components/dialog/install-edge-dialog.vue";
import InstallIosDialog from "@/components/dialog/install-ios-dialog.vue";
import InstallOperaDialog from "@/components/dialog/install-opera-dialog.vue";
import InstallCompleteDialog from "@/components/dialog/install-complete-dialog.vue";
import i18n from "@/plugins/i18n/i18n";
import { Platform } from "quasar"; 

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
    switch (true) {
      case Platform.is.ios:
        Dialog.create({
          component: InstallIosDialog
        });
        break;
      case Platform.is.opera: 
        Dialog.create({
          component: InstallOperaDialog
        });
        break;
      case Platform.is.edge: 
        Dialog.create({
          component: InstallEdgeDialog
        });
        break;
      default:
      // To be implemented: Handle unknown browsers with a generic message or action
    }
  }

  return {
    appInstalledPrompt,
    beforeInstallPromptEvent,
    isAppInstalled,
    isInStandaloneMode,
    notifyNativeInstall,
    promptInstall,
    shouldShowInstallButton,
    showAppInstallButton,
    showPlatformGuidance
  };
}
