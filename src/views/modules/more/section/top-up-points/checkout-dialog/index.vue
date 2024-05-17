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
            <q-card-section>
              <q-card-section :style="$q.screen.gt.xs ? 'width: 480px' : 'width : 100%'">
                <header-section />
                <package-options-section />
                <q-item-label
                  class="q-mx-md q-mt-lg"
                  style="letter-spacing: 1px; font-size: 16px; font-weight: bold"
                  >Payment Options</q-item-label
                >
                <q-option-group
                  inline
                  class="q-ml-sm"
                  v-model="selectedPaymentOption"
                  :options="paymentOptions"
                  color="primary"
                />
                <div v-show="selectedPaymentOption == 'credit_card'">
                  <credit-card-section @update-dialog-status="updateDialogState" />
                </div>
                <div v-show="selectedPaymentOption == 'stripe'"><stripe-checkout-section /></div>
              </q-card-section>
            </q-card-section>
          </q-card>
        </q-page>
      </q-page-container>
    </q-layout>
  </q-dialog>
</template>

<script setup lang="ts">
  import PackageOptionsSection from "./package-options-section.vue";
  import CreditCardSection from "./credit-card-section.vue";
  import HeaderSection from "./header-section.vue";
  import StripeCheckoutSection from "./stripe-checkout/index.vue";
  import { useDialogPluginComponent } from "quasar";
  import { useUtilities } from "@/composable/use-utilities";

  defineProps({
    callback: {
      type: Function,
      required: true
    }
  });

  const { eventBus } = useUtilities();
  const { dialogRef } = useDialogPluginComponent();

  const isDialogVisible = ref();
  const selectedPaymentOption = ref("credit_card");
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

  const paymentOptions = [
    {
      label: "Pay by credit card",
      value: "credit_card"
    },
    {
      label: "Pay by stripe",
      value: "stripe"
    }
  ];
</script>
