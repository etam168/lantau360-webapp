import { createRouter, createWebHistory } from "vue-router";

import drawerRouter from "./modules/drawer";
import extraRoutes from "./modules/extra";
export const asyncRoutes = [...drawerRouter];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [...asyncRoutes, ...extraRoutes]
});

export default router;
