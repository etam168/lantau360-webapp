export function useMember() {
  function promptUserLogon() {
    const $q = useQuasar();
    $q.dialog({
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
