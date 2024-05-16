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
        <app-dialog-title>{{ $t("more.profileSetting.buyPoints") }}</app-dialog-title>
      </q-header>

      <q-page-container>
        <q-page>
          <q-card flat class="row justify-center items-center q-mx-lg">
            <q-card-section :style="$q.screen.gt.xs ? 'width: 600px' : 'width : 100%'">
              <free-top-up-module class="q-mt-sm" @close-dialog="updateDialogState" />

              <purchanse-top-up-module class="q-mt-lg" @close-dialog="updateDialogState" />
            </q-card-section>
          </q-card>
        </q-page>
      </q-page-container>
    </q-layout>
  </q-dialog>
</template>

<script setup lang="ts">
  import { useDialogPluginComponent } from "quasar";
  import { useUtilities } from "@/composable/use-utilities";
  import FreeTopUpModule from "./free-top-up-module.vue";
  import PurchanseTopUpModule from "./purchanse-top-up-module.vue";

  const { eventBus } = useUtilities();
  const { dialogRef } = useDialogPluginComponent();

  const isDialogVisible = ref();

  onMounted(() => {
    eventBus.on("CreditCardDialog", () => {
      isDialogVisible.value = false;
      isDialogVisible.value = false;
    });
  });

  function updateDialogState(status: any) {
    isDialogVisible.value = status;
    eventBus.emit("DialogStatus", status, "CreditCardDialog");
  }
</script>
