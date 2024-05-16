<template>
  <stripe-checkout
    ref="checkoutRef"
    mode="payment"
    :pk="publishableKey"
    :line-items="lineItems"
    :success-url="successURL"
    :cancel-url="cancelURL"
    @loading="(v: any) => (loading = v)"
  />
</template>

<script setup lang="ts">
  import { StripeCheckout } from "@vue-stripe/vue-stripe";

  const publishableKey = "pk_test_cM0Cj4pEuFceQLmeRNtM9sW400S5FJBvAt";
  const successURL = "https://app-dev.lantau360.com/stripe-success";
  const cancelURL = "https://app-dev.lantau360.com/stripe-cancel";
  const loading = false;
  const checkoutRef = inject("stripeCheckoutRef") as Ref;
  const lineItems = [
    {
      price: "price_1PH3WiKoVaDaLA5GhCh3tebl",
      quantity: 1
    },
    {
      price: "price_1PGd3HKoVaDaLA5G5XpKvW2M",
      quantity: 1
    }
  ];

  // const submit = () => {
  //   // You will be redirected to Stripe's secure checkout page
  //   checkoutRef.value.redirectToCheckout();
  // };
</script>
