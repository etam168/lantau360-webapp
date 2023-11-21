<template>
  <q-dialog
    ref="dialogRef"
    @hide="onDialogHide"
    maximized
    transition-show="slide-up"
    transition-hide="slide-down"
  >
    <q-card class="bg-green-1">
      <q-layout view="hHh lpR fFf">
        <app-dialog-bar :barTitle="$t(title)" />

        <q-page-container>
          <q-card-section class="q-pa-lg">
            <component
              :is="CreateUpdateForm"
              :row="row"
              :method="method"
              @onOKClick="onOKClick"
              @onDialogHide="onDialogHide"
              @onCancelClick="onCancelClick"
              class="q-pt-lg"
            />
          </q-card-section>
        </q-page-container>
      </q-layout>
    </q-card>
  </q-dialog>
</template>

<script lang="ts">
  import { defineComponent, ref } from "vue";

  // Custom Components
  import AppDialogBar from "@/components/dialogs/app-dialog-bar.vue";

  //3rd party
  import { useDialogPluginComponent } from "quasar";

  export default defineComponent({
    name: "CreateUpdateDialog",

    props: {
      row: {
        type: Object
      },
      title: {
        type: String
      },
      method: {
        type: String
      },
      CreateUpdateForm: {
        type: Object
      }
    },

    components: {
      AppDialogBar
    },

    emits: [...useDialogPluginComponent.emits],

    setup() {
      const loading = ref(false);

      const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } = useDialogPluginComponent();

      return {
        loading,
        dialogRef,
        // widthh,

        onDialogHide,

        onOKClick(values) {
          onDialogOK(values);
        },

        onCancelClick: onDialogCancel
      };
    }
  });
</script>
