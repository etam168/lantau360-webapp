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
            <div>
              <stripe-checkout
                ref="checkoutRef"
                mode="payment"
                :pk="publishableKey"
                :line-items="lineItems"
                :success-url="successURL"
                :cancel-url="cancelURL"
                @loading="(v: any) => (loading = v)"
              />
              <q-btn class="button button4" @click="submit">Buy now</q-btn>
            </div>
          </q-card>
        </q-page>
      </q-page-container>
    </q-layout>
  </q-dialog>
</template>

<script setup lang="ts">
  import { StripeCheckout } from "@vue-stripe/vue-stripe";
  import { useDialogPluginComponent } from "quasar";

  const publishableKey = "pk_test_cM0Cj4pEuFceQLmeRNtM9sW400S5FJBvAt";
  const successURL = "https://app-dev.lantau360.com/stripe-success";
  const cancelURL = "https://app-dev.lantau360.com/stripe-cancel";
  const loading = false;
  const checkoutRef = ref();
  const isDialogVisible = ref();
  const { eventBus } = useUtilities();
  const { dialogRef } = useDialogPluginComponent();

  const lineItems = [
    {
      price: "price_1PGd3HKoVaDaLA5GPdKaTS5Y",
      quantity: 1
    }
  ];

  const submit = () => {
    // You will be redirected to Stripe's secure checkout page
    checkoutRef.value.redirectToCheckout();
  };

  onMounted(() => {
    eventBus.on("StripePaymentDialog", () => {
      isDialogVisible.value = false;
      isDialogVisible.value = false;
    });
  });

  function updateDialogState(status: any) {
    isDialogVisible.value = status;
    eventBus.emit("DialogStatus", status, "StripePaymentDialog");
  }
</script>
