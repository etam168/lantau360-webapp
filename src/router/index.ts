import { useUserStore } from "@/stores/user";
import { createRouter, createWebHistory } from "vue-router";

/* Router Modules */
import authRouter from "./modules/auth";
import drawerRouter from "./modules/drawer";

export const constantRoutes = [...authRouter];
export const asyncRoutes = [...drawerRouter];

const whiteList = []
  .concat(Array.from(authRouter, route => route.path))
  .concat(Array.from(authRouter, route => route.alias))
  .concat("/auth/register")
  .filter(route => route); // remove undefined element

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: constantRoutes
});

// router-guard
router.beforeEach(async (to, from, next) => {
  const userStore = useUserStore();

  try {
    // show registration if user has referral key
    if (to.path === "/registration" && to.query.key) {
      next();
      return;
    }

    if (to.path === "/auth/resetPassword") {
      next();
      return;
    }

    // const isValidRoute = router.getRoutes().some(route => route.path === to.path);
    // if (!isValidRoute) {
    //   next({ name: "not-found" });
    // }

    // determine if there has token
    if (userStore.token) {
      if (whiteList.includes(to.path)) {
        next({ path: "/" });
      } else {
        next();
      }
    } else {
      if (whiteList.includes(to.path)) {
        next();
      } else {
        next(`/auth/login?redirect=${to.path}`);
      }
    }
  } catch (err) {
    alert("sdafads");
    //console.warn(`[router.beforeEach]\t${to.path}: ${err}`);
  }
});

export default router;
