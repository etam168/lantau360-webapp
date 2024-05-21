<template>
  <q-dialog
    ref="dialogRef"
    transition-show="slide-up"
    transition-hide="slide-down"
    @update:model-value="updateDialogState"
    :model-value="isDialogVisible"
    maximized
  >
    <q-layout view="lHh lpr lFf" class="bg-white" style="max-width: 1024px">
      <q-header class="bg-transparent text-dark">
        <app-dialog-title />
      </q-header>

      <q-page-container>
        <q-page>
          <q-card
            flat
            class="row justify-center items-center"
            style="min-height: calc(100vh - 50px)"
          >
            <q-card-section :style="$q.screen.gt.xs ? 'width: 300px' : 'width : 100%'">
              <q-img :src="IMAGES.INSUFFICIENT_POINT" />
              <q-item-label
                style="font-weight: 600"
                class="text-caption text-grey-8 text-center q-mt-sm"
              >
                {{ $t("community.alertDialog.insufficientPoints") }}
              </q-item-label>
              <q-card-actions class="q-px-none no-wrap">
                <!-- <div class="row"> -->
                <app-button
                  class="full-width q-mx-xs"
                  :label="$t('action.cancel')"
                  color="red"
                  type="submit"
                  @click="handleCancel"
                />
                <div class="q-mx-xs"></div>

                <app-button
                  class="full-width"
                  :label="$t('community.alertDialog.gotoAccount')"
                  color="primary"
                  type="submit"
                  @click="handleGoToAccount"
                />

                <!-- </div> -->
              </q-card-actions>
            </q-card-section>
          </q-card>
        </q-page>
      </q-page-container>
    </q-layout>
  </q-dialog>
</template>

<script setup lang="ts">
  import { useDialogPluginComponent } from "quasar";
  import { IMAGES } from "@/constants";

  import { useUtilities } from "@/composable/use-utilities";

  const { eventBus } = useUtilities();
  const { dialogRef, onDialogCancel } = useDialogPluginComponent();
  const isDialogVisible = ref();

  onMounted(() => {
    eventBus.on("AlertDialog", () => {
      isDialogVisible.value = false;
    });
  });

  function updateDialogState(status: any) {
    isDialogVisible.value = status;
    eventBus.emit("DialogStatus", status, "AlertDialog");
  }

  function handleCancel() {
    onDialogCancel();
  }

  function handleGoToAccount() {
    onDialogCancel();
    setTimeout(() => {
      eventBus.emit("navigateToMore");
    }, 1200);
  }
</script>
