import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { RouteRecordRaw } from "vue-router";
import router, { asyncRoutes } from "@/router";

const hasPermission = (roles: any, route: any) => {
  if (route.meta && route.meta.roles) {
    return roles.some((role: any) => route.meta.roles.includes(role));
  }
  return false;
};

const filterAsyncRoutes = (roles: any, routes: RouteRecordRaw[]): RouteRecordRaw[] => {
  const res: RouteRecordRaw[] = [];
  routes.forEach(route => {
    const tmp = { ...route };
    if (hasPermission(roles, tmp)) {
      if (tmp.children) {
        tmp.children = filterAsyncRoutes(roles, tmp.children);
      }
      res.push(tmp);
    }
  });
  return res;
};

export const usePermissionStore = defineStore(
  "permission",
  () => {
    // State
    const routes = ref<RouteRecordRaw[]>([]);
    const addRoutes = ref<RouteRecordRaw[]>([]);

    // Getter
    const permissionRoutes = computed(() => routes.value);

    // Action
    function GenerateRoutes(userData: any) {
      try {
        const { roles } = userData;

        const accessedRoutes: RouteRecordRaw[] = filterAsyncRoutes(roles, asyncRoutes);

        if (accessedRoutes.length > 0 && accessedRoutes[0].children) {
          addRoutes.value = accessedRoutes[0].children;
        } else {
          addRoutes.value = [];
        }

        accessedRoutes.forEach(asyncRoute => {
          router.addRoute(asyncRoute);
        });
      } catch (err) {
        // Error handling if needed
      }
    }

    return {
      routes,
      addRoutes,
      permissionRoutes,
      GenerateRoutes
    };
  },
  {
    persist: true
  }
);
