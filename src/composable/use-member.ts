import { Dialog } from "quasar";

export function useMember() {
  function promptUserLogon() {
    Dialog.create({
      component: defineAsyncComponent(() => import("@/components/dialog/login-alert-dialog.vue")),
      componentProps: {
        mode: "login"
      }
    });
  }

  return {
    promptUserLogon
  };
}
