import { RouteRecordRaw } from "vue-router";

const emailConfirmationRoute: RouteRecordRaw = {
  path: "/email-confirmation",
  name: "emailConfirmation",
  component: () => import("@/views/auth/email-confirmation.vue")
};

const offlineModeRoute: RouteRecordRaw = {
  path: "/offline-page",
  name: "offlinePage",
  component: () => import("@/views/modules/offline-mode/index.vue")
};

const stripetTranactionSuccessPage: RouteRecordRaw = {
  path: "/stripe-success",
  name: "stripeSuccess",
  component: () =>
    import(
      "@/views/modules/more/section/top-up-points/checkout-dialog/stripe-checkout/success-page.vue"
    )
};

const stripeTransactionCancelledPage: RouteRecordRaw = {
  path: "/stripe-cancel",
  name: "stripeCancel",
  component: () =>
    import(
      "@/views/modules/more/section/top-up-points/checkout-dialog/stripe-checkout/cancel-page.vue"
    )
};

const extraRoutes = [
  emailConfirmationRoute,
  offlineModeRoute,
  stripetTranactionSuccessPage,
  stripeTransactionCancelledPage
];
export default extraRoutes;
