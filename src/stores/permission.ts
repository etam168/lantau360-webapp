import { defineStore } from "pinia";
import { RouteRecordRaw } from "vue-router";
import router, { asyncRoutes } from "@/router";

/**
 * Through meta.role determines whether the current user rights match
 * @param roles
 * @param route
 */
const hasPermission = (roles: any, route: any) => {
  if (route.meta && route.meta.roles) {
    return roles.some((role: any) => route.meta.roles.includes(role));
  }
  return false;
};

/**
 * Recursively filter asynchronous routing tables to return routing tables
 * that meet user role permissions
 * @param roles
 * @param routes asyncRoutes
 */
export const filterAsyncRoutes = (roles: any, routes: Array<RouteRecordRaw>) => {
  const res = <any>[];
  routes.forEach((route: any) => {
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

export const usePermissionStore = defineStore("permission", {
  state: () => {
    return { routes: [], addRoutes: <any>[] };
  },
  getters: {
    permissionRoutes: state => state.routes
  },

  actions: {
    GenerateRoutes(userData: any) {
      try {
        const { roles } = userData;

        const accessedRoutes: Array<RouteRecordRaw> = filterAsyncRoutes(roles, asyncRoutes);

        this.addRoutes = accessedRoutes[0].children;
        //this.routes = constantRoutes.concat(accessedRoutes[0].children);
        // Apply selected allowed routes
        accessedRoutes.forEach(asyncRoute => {
          router.addRoute(asyncRoute);
        });
      } catch (err) {
        //console.warn("[pinia].permission] GenerateRoutes", err);
      }
    }
  },
  persist: true
});
