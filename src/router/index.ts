import { createRouter, createWebHistory } from "vue-router";

import drawerRouter from "./modules/drawer";

// export const constantRoutes = [...authRouter];
export const asyncRoutes = [...drawerRouter];

const emaiConfitmationRoute = {
  path: "/email-confirmation",
  name: "emailConfirmation",
  component: () => import("@/views/auth/email-confirmation.vue")
};

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [...asyncRoutes, emaiConfitmationRoute]
});

export default router;
