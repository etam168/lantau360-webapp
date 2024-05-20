<template>
  <div class="q-ml-md">
    <q-item-label
      class="q-mt-lg q-mb-md"
      style="letter-spacing: 1px; font-size: 16px; font-weight: bold"
      >{{ $t("more.account.payByStrip") }}</q-item-label
    >
    <stripe-checkout
      ref="checkoutRef"
      mode="payment"
      :pk="STRIPE_PUBLISH_KEY"
      :line-items="lineItems"
      :success-url="successURL"
      :cancel-url="cancelURL"
      @loading="(v: any) => (loading = v)"
    />
    <app-button
      :label="$t('more.creditCard.proceedToPay')"
      :loading="loading"
      class="full-width"
      color="primary"
      @click="onBtnClick"
      size="md"
    />
  </div>
</template>

<script setup lang="ts">
  import { BASE_WEBAPP_LITE_URL, STRIPE_PUBLISH_KEY } from "@/constants";
  import i18n from "@/plugins/i18n/i18n";
  import { StripeCheckout } from "@vue-stripe/vue-stripe";

  const { notify } = useUtilities();
  const { t } = i18n.global;
  const loading = ref(false);
  const checkoutRef = ref();
  const selectedPackage = inject("selectedPackage") as Ref<any>;

  const successURL = computed(() => {
    return `${BASE_WEBAPP_LITE_URL}/stripe-success?points=${selectedPackage.value.points}&amount=${selectedPackage.value.amount}`;
  });
  const cancelURL = `${BASE_WEBAPP_LITE_URL}/stripe-cancel`;
  const lineItems = computed(() => [
    {
      price: selectedPackage.value.stripePriceId,
      quantity: 1
    }
  ]);

  function onBtnClick() {
    if (checkoutRef.value) checkoutRef.value.redirectToCheckout();
    else notify(t("more.message.stripeReferenceNotInitiazed"), "negative");
  }
</script>
