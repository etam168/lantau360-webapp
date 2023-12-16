<template>
  <suspense>
    <template #default>
      <q-dialog
        ref="dialogRef"
        @hide="onDialogHide"
        transition-show="slide-up"
        transition-hide="slide-down"
        @update:model-value="updateDialogState"
        :model-value="isDialogVisible"
        maximized
      >
        <q-layout view="lHh lpr lFf" class="bg-white" style="max-width: 1024px">
          <q-header class="bg-transparent text-dark">
            <app-dialog-title>{{
              $t(`content.title.${contentDataValue.contentName}`)
            }}</app-dialog-title>
          </q-header>

          <q-page-container>
            <q-page>
              <q-item>
                <div
                  v-html="
                    translate(contentDataValue.contentData, contentDataValue.meta, 'contentData')
                  "
                ></div
              ></q-item>
            </q-page>
          </q-page-container>
        </q-layout>
      </q-dialog>
    </template>
    <template #fallback>
      <div class="row justify-center items-center" style="height: 500px">
        <app-spinner size="10em" />
      </div>
    </template>
  </suspense>
</template>

<script setup lang="ts">
  // Other Import
  import { useDialogPluginComponent } from "quasar";
  import { useUtilities } from "@/composable/use-utilities";
  import eventBus from "@/utils/event-bus";

  defineProps({
    contentDataValue: {
      type: Object as PropType<any>
    }
  });

  const { translate } = useUtilities();
  const { dialogRef, onDialogHide } = useDialogPluginComponent();
  const isDialogVisible = ref();

  onMounted(() => {
    eventBus.on("ContentDialog", () => {
      isDialogVisible.value = false;
    });
  });

  function updateDialogState(status: any) {
    isDialogVisible.value = status;
    eventBus.emit("DialogStatus", status, "ContentDialog");
  }
</script>
