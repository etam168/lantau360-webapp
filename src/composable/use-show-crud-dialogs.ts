// 3rd party
import { Dialog } from "quasar";

import { defineAsyncComponent } from "vue";

export default function useCrudDialogs() {
  function showCreateUpdateDialog(inputForm: any, data: any, title: string, mode: string) {
    Dialog.create({
      component: defineAsyncComponent(
        () => import("@/components/dialogs/create-update-dialog.vue")
      ),
      componentProps: {
        row: data,
        title: title,
        method: mode,
        CreateUpdateForm: inputForm
      }
    });
  }

  function showDeleteDialog(
    title: string,
    prompt: string,
    url: string,
    successMessage: string,
    mode: string
  ) {
    Dialog.create({
      component: defineAsyncComponent(() => import("@/components/dialogs/delete-dialog-et.vue")),
      componentProps: {
        title: title,
        method: mode,
        prompt: prompt,
        url: url,
        successMessage: successMessage
      }
    });
  }

  function showInputUpdateDialog(data: object) {
    Dialog.create({
      component: defineAsyncComponent(
        () => import("@/views/modules/weather/input-dialog/index.vue")
      ),
      componentProps: {
        props: data
      }
    });
  }

  return {
    showCreateUpdateDialog,
    showDeleteDialog,
    showInputUpdateDialog
  };
}
