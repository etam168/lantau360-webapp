import { defineStore } from "pinia";
import router, { asyncRoutes, constantRoutes } from "@/router";

/**
 * Through meta.role determines whether the current user rights match
 * @param roles
 * @param route
 */
const hasPermission = (roles, route) => {
  if (route.meta && route.meta.roles) {
    return roles.some(role => route.meta.roles.includes(role));
  }
  return false;
};

/**
 * Recursively filter asynchronous routing tables to return routing tables
 * that meet user role permissions
 * @param roles
 * @param routes asyncRoutes
 */
export const filterAsyncRoutes = (roles, routes) => {
  const res = [];
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

export const usePermissionStore = defineStore("permission", {
  state: () => {
    return { routes: [], addRoutes: [] };
  },
  getters: {
    permissionRoutes: state => state.routes
  },

  actions: {
    GenerateRoutes({ roles }) {
      try {
        const accessedRoutes = filterAsyncRoutes(roles, asyncRoutes);

        this.addRoutes = accessedRoutes[0].children;
        this.routes = constantRoutes.concat(accessedRoutes[0].children);
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
