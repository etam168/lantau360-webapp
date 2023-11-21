import { Role } from "@/constants";

export const moreRoutes = [
  {
    path: "/settings",
    name: "Settings",
    component: () => import("@/views/modules/settings/index.vue"),
    meta: {
      title: "route.drawerComponents.settings",
      icon: "mdi-cog",
      group: "more",
      roles: [Role.CS_ADMIN, Role.FRONT_DESK, Role.AGENT]
    }
  },
  {
    path: "/verison",
    name: "Verison",
    component: () => import("@/views/modules/version/index.vue"),
    meta: {
      title: "route.drawerComponents.version",
      icon: "mdi-counter",
      group: "more",
      roles: [Role.CS_ADMIN, Role.FRONT_DESK, Role.AGENT]
    }
  }
];
