<template>
  <q-dialog ref="dialogRef" @hide="onDialogHide" persistent>
    <q-card>
      <q-toolbar class="bg-green text-white">{{ $t(title) }}</q-toolbar>
      <q-card-section class="row items-center">
        <span class="q-ml-sm">{{ deleteConfirm }}</span>
      </q-card-section>

      <q-card-actions align="right">
        <q-btn flat :label="$t('dialog.cancel')" color="green" @click="onCancelClick" />
        <q-btn
          flat
          :label="$t('dialog.delete')"
          color="negative"
          @click="onOKClick"
          :disable="loading"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script lang="ts">
  import { defineComponent, ref } from "vue";

  import { Notify, useDialogPluginComponent } from "quasar";
  import api from "@/api/crud";

  import i18n from "@/plugins/i18n/i18n";
  import eventBus from "@/utils/event-bus";

  function notify(message: string, type: string) {
    Notify.create({
      message: message,
      type: type
    });
  }

  export default defineComponent({
    name: "DeleteDialog",

    props: {
      title: {
        type: String
      },
      prompt: {
        type: String
      },
      url: {
        type: String
      },
      successMessage: {
        type: String
      },
      method: {
        type: String
      }
    },

    emits: [...useDialogPluginComponent.emits],

    setup(props) {
      const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } = useDialogPluginComponent();

      const { t } = i18n.global;
      const prompt = ref(props.prompt);
      const deleteConfirm = t("dialog.deleteMessage") + " " + prompt.value + "?";

      const loading = ref(false);

      async function onOKClick() {
        const url = ref(props.url);

        const successMessage = t(props.successMessage);

        try {
          loading.value = true;
          await api.delete(url.value);
          notify(successMessage, "positive");

          onDialogOK();
          if (props.method == "deleteData") {
            eventBus.emit("LoadData");
            loading.value = false;
          } else {
            eventBus.emit("RefreshGallery");
            loading.value = false;
          }
        } catch (e) {
          notify(e.message, "negative");
          loading.value = false;
        }
      }

      return {
        dialogRef,
        loading,
        deleteConfirm,

        onDialogHide,
        onOKClick,
        onCancelClick: onDialogCancel
      };
    }
  });
</script>
