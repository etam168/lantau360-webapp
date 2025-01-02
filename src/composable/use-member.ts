import { Dialog, Notify } from "quasar";
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
      <p style="margin-bottom: 0px;">Currently, You're Logout.</p>
       <p style="margin-bottom: 0px;">Please Login First.</p>
    `,
      html: true,
      color: "secondary",
      textColor: "primary",
      position: "center"
    });
  }

  return {
    localDataNotification,
    promptUserLogon
  };
}
