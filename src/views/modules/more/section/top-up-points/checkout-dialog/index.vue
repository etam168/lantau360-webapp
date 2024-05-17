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
          <q-card flat class="row justify-center items-center">
            <q-card-section horizontal>
              <q-card-section
                class="row justify-center"
                :style="$q.screen.gt.xs ? 'width: 480px' : 'width : 100%'"
              >
                <q-card
                  class="row justify-center items-center q-mb-lg"
                  :class="{ 'q-mx-lg q-mt-md': $q.screen.gt.xs }"
                  bordered
                  :style="{
                    width: $q.screen.gt.xs ? '480px' : '100%',
                    'border-radius': '15px',
                    height: '100px',
                    'border-color': 'primary'
                  }"
                >
                  <div style="display: flex; flex-direction: column">
                    <div style="letter-spacing: 2px; font-size: 17px">
                      {{ $t("more.account.availablePointBalance") }}
                    </div>
                    <div style="text-align: center">
                      <span style="font-size: 28px; font-weight: 500; letter-spacing: 2px">{{
                        availabelPoints
                      }}</span>
                    </div>
                  </div>
                </q-card>

                <div
                  :class="{ 'q-ml-lg': $q.screen.gt.xs }"
                  :style="{
                    width: $q.screen.gt.xs ? '480px' : '100%'
                  }"
                >
                  <q-item-label
                    class="q-ml-sm q-mb-sm"
                    style="letter-spacing: 2px; font-size: 20px; font-weight: bold"
                    >{{ $t("more.account.topUpYourAccount") }}</q-item-label
                  >
                  <q-item-label
                    class="q-mx-sm q-my-md"
                    style="letter-spacing: 1px; font-size: 16px; color: #888"
                    >{{ $t("more.account.essentialInformation") }}</q-item-label
                  >

                  <q-item-label
                    class="q-mx-sm q-mt-lg"
                    style="letter-spacing: 1px; font-size: 16px; font-weight: bold"
                    >{{ $t("more.account.topUpAmount") }}</q-item-label
                  >
                </div>
                <package-options-section />
                <credit-card-section @update-dialog-status="updateDialogState" />
              </q-card-section>
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
  import PackageOptionsSection from "./package-options-section.vue";
  import CreditCardSection from "./credit-card-section.vue";

  import { useUserStore } from "@/stores/user";

  const { eventBus } = useUtilities();
  const { dialogRef } = useDialogPluginComponent();
  const { availabelPoints } = useUserStore();

  const isDialogVisible = ref();
  //const $q = useQuasar();

  defineProps({
    callback: {
      type: Function,
      required: true
    }
  });

  const selectedPackage = ref();
  provide("selectedPackage", selectedPackage);

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
