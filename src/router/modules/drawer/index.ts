import { RouteRecordRaw } from "vue-router";
import Error404 from "@/views/modules/errors/error-404.vue";
import { fasBriefcase, fasHouse } from "@quasar/extras/fontawesome-v6";

const drawerRouter: Array<RouteRecordRaw> = [
  {
    path: "/",
    component: () => import("@/views/layout/index.vue"),
    meta: {},
    children: [
      {
        path: "/",
        alias: "/home",
        component: () => import("@/views/modules/home/index.vue"),
        meta: {
          title: "route.drawerComponents.home",
          icon: fasHouse,
          group: "common"
        }
      },
      {
        path: "/business",
        name: "business",
        component: () => import("@/views/modules/business/index.vue"),
        meta: {
          title: "route.drawerComponents.business",
          icon: fasBriefcase,
          group: "common"
        }
      },
      {
        path: "/community",
        name: "community",
        component: () => import("@/views/modules/community/index.vue"),
        meta: {
          title: "route.drawerComponents.community",
          icon: fasBriefcase,
          group: "common"
        }
      },
      {
        path: "/favourite",
        name: "favourite",
        component: () => import("@/views/modules/favourite/index.vue"),
        meta: {
          title: "route.drawerComponents.favourites",
          icon: fasBriefcase,
          group: "common"
        }
      },
      {
        path: "/more",
        name: "more",
        component: () => import("@/views/modules/more/index.vue"),
        meta: {
          title: "route.drawerComponents.more",
          icon: fasBriefcase,
          group: "common"
        }
      },
      {
        path: "/email-confirmation",
        name: "email-confirmation",
        component: () => import("@/views/auth/email-confirmation.vue"),
        meta: {
          title: "route.drawerComponents.more",
          icon: fasBriefcase,
          group: "common"
        }
      },
      {
        path: "/:catchAll(.*)",
        name: "not-found",
        component: Error404,
        meta: {}
      }
    ]
  }
];

export default drawerRouter;
