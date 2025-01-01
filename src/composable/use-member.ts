import { Dialog, Notify } from "quasar";
// Third party imports
import { fasTriangleExclamation } from "@quasar/extras/fontawesome-v6";

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
      <p style="margin-bottom: 0px;">Currently you're using Local Version.</p>
    `,
      html: true,
      color: "warning",
      position: "center",
      icon: fasTriangleExclamation,
      actions: [
        {
          label: "Yes",
          color: "white",
          handler: async () => {}
        },
        {
          label: "OK",
          color: "white", // If the user cancels
          handler: () => {
            // Do nothing, simply dismiss the notification
          }
        }
      ]
    });
  }

  return {
    localDataNotification,
    promptUserLogon
  };
}
