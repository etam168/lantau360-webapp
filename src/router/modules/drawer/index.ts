import { RouteRecordRaw } from "vue-router";
import { Role } from "@/constants";
import Error404 from "@/views/modules/errors/error-404.vue";
import { administratorRoutes } from "./administrator-routes";
import { moreRoutes } from "./more-routes";

const drawerRouter: Array<RouteRecordRaw> = [
  {
    path: "/",
    component: () => import("@/views/layout/index.vue"),
    meta: {
      roles: [Role.CS_ADMIN, Role.FRONT_DESK, Role.AGENT]
    },
    children: [
      {
        path: "/",
        alias: "/dashboard",
        component: () => import("@/views/modules/dashboard/index.vue"),
        meta: {
          title: "route.drawerComponents.dashboard",
          icon: "home",
          group: "common",
          roles: [Role.CS_ADMIN, Role.FRONT_DESK, Role.AGENT]
        }
      },

      ...administratorRoutes,
      ...moreRoutes,

      {
        path: "/:catchAll(.*)",
        name: "not-found",
        component: Error404,
        meta: {
          roles: [Role.CS_ADMIN, Role.FRONT_DESK, Role.AGENT]
        }
      }
    ]
  }
];

export default drawerRouter;
