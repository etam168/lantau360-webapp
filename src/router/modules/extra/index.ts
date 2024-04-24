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

const extraRoutes = [emailConfirmationRoute, offlineModeRoute];
export default extraRoutes;
