<template>
  <suspense>
    <template #default>
      <q-dialog
        ref="dialogRef"
        @hide="onDialogHide"
        transition-show="slide-up"
        transition-hide="slide-down"
        :model-value="isDialogVisible"
        maximized
      >
        <q-layout view="lHh lpr lFf" class="bg-white" style="max-width: 1024px">
          <q-header class="bg-transparent text-dark">
            <app-dialog-title>{{ title }}</app-dialog-title>
          </q-header>

          <q-page-container>
            <q-page>
              <q-item>
                <div v-html="translate(data?.contentData, data?.meta, 'contentData')"></div
              ></q-item>
            </q-page>
          </q-page-container>
        </q-layout>
      </q-dialog>
    </template>
    <template #fallback>
      <div class="row justify-center items-center" style="height: 500px"></div>
    </template>
  </suspense>
</template>

<script setup lang="ts">
  import { useDialogPluginComponent } from "quasar";

  defineProps({
    data: {
      type: Object as PropType<any>
    },
    title: {
      type: String,
      required: true
    }
  });

  const { translate } = useUtilities();
  const { dialogRef, onDialogHide } = useDialogPluginComponent();
  const isDialogVisible = ref();
</script>
