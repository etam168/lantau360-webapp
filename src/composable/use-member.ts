import { Dialog, Notify } from "quasar";
import i18n from "@/plugins/i18n/i18n";
const { t } = i18n.global;
// Third party imports

export function UserLogon() {
  function promptUserLogon() {
    Dialog.create({
      component: defineAsyncComponent(() => import("@/components/dialog/login-alert-dialog.vue")),
      componentProps: {
        mode: "login"
      }
    });
  }

  function localDataNotification() {
    Notify.create({
      message: `
      <p style="margin-bottom: 0px;">${t("notification.enterOfflineMode")}</p>
      <p style="margin-bottom: 0px;">${t("notification.accessAllFeatures")}</p>
    `,
      html: true,
      color: "primary",
      position: "bottom"
    });
  }

  return {
    localDataNotification,
    promptUserLogon
  };
}
