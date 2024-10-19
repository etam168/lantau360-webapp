import { RouteRecordRaw } from "vue-router";

const emailConfirmationRoute: RouteRecordRaw = {
  path: "/email-confirmation",
  name: "emailConfirmation",
  component: () => import("@/views/auth/email-confirmation.vue")
};

// const stripetTranactionSuccessPage: RouteRecordRaw = {
//   path: "/stripe-success",
//   name: "stripeSuccess",
//   component: () =>
//     import(
//       "@/views/modules/more/section/profile-account-dialog/top-up-points/checkout-dialog/stripe-checkout/success-page.vue"
//     )
// };

// const stripeTransactionCancelledPage: RouteRecordRaw = {
//   path: "/stripe-cancel",
//   name: "stripeCancel",
//   component: () =>
//     import(
//       "@/views/modules/more/section/profile-account-dialog/top-up-points/checkout-dialog/stripe-checkout/cancel-page.vue"
//     )
// };

const extraRoutes = [
  emailConfirmationRoute

  // stripetTranactionSuccessPage,
  // stripeTransactionCancelledPage
];
export default extraRoutes;
