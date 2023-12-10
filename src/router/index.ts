import { createRouter, createWebHistory } from "vue-router";

import drawerRouter from "./modules/drawer";

// export const constantRoutes = [...authRouter];
export const asyncRoutes = [...drawerRouter];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: asyncRoutes
});

export default router;
