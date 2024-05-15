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
        <app-dialog-title>{{ $t("more.creditCard.title") }}</app-dialog-title>
      </q-header>

      <q-page-container>
        <q-page>
          <q-item class="row justify-center items-center q-my-lg">
            <q-avatar size="128px" square> <q-img :src="logo" /> </q-avatar
          ></q-item>
          <q-card flat class="row justify-center items-center q-mx-lg">
            <q-card-section horizontal>
              <q-item-section class="q-px-md q-pb-md row items-center">
                <free-top-up-module @close-dialog="updateDialogState" />
              </q-item-section>

              <q-separator vertical class="q-mx-xl" />
              <q-item-section class="row justify-center" style="margin-top: -16px">
                <purchanse-top-up-module @close-dialog="updateDialogState" />
              </q-item-section>
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
  const logo = ref("/img/logo/logo.png");

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
