import { RouteRecordRaw } from "vue-router";
import { Role } from "@/constants";
import Error404 from "@/views/modules/errors/error-404.vue";
// import { moreRoutes } from "./more-routes";

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
        alias: "/home",
        component: () => import("@/views/modules/home/index.vue"),
        meta: {
          title: "route.drawerComponents.home",
          icon: "home",
          group: "common",
          roles: [Role.CS_ADMIN, Role.FRONT_DESK, Role.AGENT]
        }
      },
      {
        path: "/businesses",
        name: "businesses",
        component: () => import("@/views/modules/business/index.vue"),
        meta: {
          title: "route.drawerComponents.business",
          icon: "mdi-briefcase-check",
          group: "common",
          roles: [Role.CS_ADMIN, Role.FRONT_DESK, Role.AGENT]
        }
      },
      {
        path: "/community",
        name: "community",
        component: () => import("@/views/modules/community/index.vue"),
        meta: {
          title: "route.drawerComponents.community",
          icon: "mdi-briefcase-check",
          group: "common",
          roles: [Role.CS_ADMIN, Role.FRONT_DESK, Role.AGENT]
        }
      },
      {
        path: "/favourites",
        name: "favourites",
        component: () => import("@/views/modules/favourites/index.vue"),
        meta: {
          title: "route.drawerComponents.favourites",
          icon: "mdi-briefcase-check",
          group: "common",
          roles: [Role.CS_ADMIN, Role.FRONT_DESK, Role.AGENT]
        }
      },
      {
        path: "/more",
        name: "more",
        component: () => import("@/views/modules/more/index.vue"),
        meta: {
          title: "route.drawerComponents.more",
          icon: "mdi-briefcase-check",
          group: "common",
          roles: [Role.CS_ADMIN, Role.FRONT_DESK, Role.AGENT]
        }
      },

      {
        path: "/site-directory-items",
        name: "site-directory-items",
        component: () => import("@/views/modules/site-directory/site-item.vue"),
        props: true,

        meta: {
          title: "route.drawerComponents.more",
          icon: "mdi-briefcase-check",
          group: "common",
          roles: [Role.CS_ADMIN, Role.FRONT_DESK, Role.AGENT]
        }
      },

      {
        path: "/site-directory-item-detail",
        name: "site-directory-item-detail",
        component: () => import("@/views/modules/site-directory/site-detail.vue"),
        props: true,

        meta: {
          title: "route.drawerComponents.more",
          icon: "mdi-briefcase-check",
          group: "common",
          roles: [Role.CS_ADMIN, Role.FRONT_DESK, Role.AGENT]
        }
      },

      {
        path: "/business-directory-items",
        name: "business-directory-items",
        component: () =>
          import("@/views/modules/business/section/directory/directory-item-list.vue"),
        props: true,

        meta: {
          title: "route.drawerComponents.more",
          icon: "mdi-briefcase-check",
          group: "common",
          roles: [Role.CS_ADMIN, Role.FRONT_DESK, Role.AGENT]
        }
      },

      {
        path: "/business-directory-item-detail",
        name: "business-directory-item-detail",
        component: () =>
          import("@/views/modules/business/section/directory/directory-item-detail.vue"),
        props: true,

        meta: {
          title: "route.drawerComponents.more",
          icon: "mdi-briefcase-check",
          group: "common",
          roles: [Role.CS_ADMIN, Role.FRONT_DESK, Role.AGENT]
        }
      },

      {
        path: "/privacy-policy",
        name: "Privacy",
        component: () => import("@/views/modules/content/index.vue"),
        meta: {
          title: "route.drawerComponents.privacyPolicy",
          group: "manageUsers",
          queryParam: "Privacy",
          roles: [Role.CS_ADMIN]
        }
      },
      {
        path: "/terms-and-conditions",
        name: "Terms",
        component: () => import("@/views/modules/content/index.vue"),
        meta: {
          title: "route.drawerComponents.termsAndConditions",
          group: "manageUsers",
          queryParam: "Terms",

          roles: [Role.CS_ADMIN]
        }
      },
      {
        path: "/about-us",
        name: "About",
        component: () => import("@/views/modules/content/index.vue"),
        meta: {
          title: "route.drawerComponents.aboutUs",
          group: "manageUsers",
          queryParam: "About",
          roles: [Role.CS_ADMIN, Role.FRONT_DESK]
        }
      },
      // ...administratorRoutes,
      // ...moreRoutes,

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
