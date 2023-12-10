import { RouteRecordRaw } from "vue-router";
import { Role } from "@/constants";
import Error404 from "@/views/modules/errors/error-404.vue";

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
        path: "/site-list",
        name: "site-list",
        component: () => import("@/views/modules/site-directory/site-list.vue"),
        props: true,

        meta: {
          title: "route.drawerComponents.more",
          icon: "mdi-briefcase-check",
          group: "common",
          roles: [Role.CS_ADMIN, Role.FRONT_DESK, Role.AGENT]
        }
      },

      {
        path: "/site-detail",
        name: "site-detail",
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
        path: "/business-list",
        name: "business-list",
        component: () => import("@/views/modules/business-directory/business-detail.vue"),
        props: true,

        meta: {
          title: "route.drawerComponents.more",
          icon: "mdi-briefcase-check",
          group: "common",
          roles: [Role.CS_ADMIN, Role.FRONT_DESK, Role.AGENT]
        }
      },
      {
        path: "/business-detail",
        name: "business-detail",
        component: () => import("@/views/modules/business-directory/business-detail.vue"),
        props: true,

        meta: {
          title: "route.drawerComponents.more",
          icon: "mdi-briefcase-check",
          group: "common",
          roles: [Role.CS_ADMIN, Role.FRONT_DESK, Role.AGENT]
        }
      },

      {
        path: "/community-event-list",
        name: "community-event-list",
        component: () =>
          import("@/views/modules/community-event-directory/community-event-detail.vue"),
        props: true,

        meta: {
          title: "route.drawerComponents.more",
          icon: "mdi-briefcase-check",
          group: "common",
          roles: [Role.CS_ADMIN, Role.FRONT_DESK, Role.AGENT]
        }
      },

      {
        path: "/community-event-detail",
        name: "community-event-detail",
        component: () =>
          import("@/views/modules/community-event-directory/community-event-detail.vue"),
        props: true,

        meta: {
          title: "route.drawerComponents.more",
          icon: "mdi-briefcase-check",
          group: "common",
          roles: [Role.CS_ADMIN, Role.FRONT_DESK, Role.AGENT]
        }
      },

      {
        path: "/community-list",
        name: "community-list",
        component: () => import("@/views/modules/community-directory/community-list.vue"),
        props: true,

        meta: {
          title: "route.drawerComponents.more",
          icon: "mdi-briefcase-check",
          group: "common",
          roles: [Role.CS_ADMIN, Role.FRONT_DESK, Role.AGENT]
        }
      },

      {
        path: "/community-detail",
        name: "community-detail",
        component: () => import("@/views/modules/community-directory/community-detail.vue"),
        props: true,

        meta: {
          title: "route.drawerComponents.more",
          icon: "mdi-briefcase-check",
          group: "common",
          roles: [Role.CS_ADMIN, Role.FRONT_DESK, Role.AGENT]
        }
      },
      {
        path: "/site-search",
        name: "SitesSeacrh",
        component: () => import("@/views/modules/search-site/index.vue"),
        meta: {
          title: "route.drawerComponents.sites",
          icon: "mdi-google-maps",
          group: "manageUsers",
          roles: [Role.CS_ADMIN]
        }
      },
      {
        path: "/business-search",
        name: "BusinessSeacrh",
        component: () => import("@/views/modules/search-business/index.vue"),
        meta: {
          title: "route.drawerComponents.sites",
          icon: "mdi-google-maps",
          group: "manageUsers",
          roles: [Role.CS_ADMIN]
        }
      },
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
