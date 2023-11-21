import { Role } from "@/constants";

export const websiteContentRoutes = [
  {
    path: "/requestMessage",
    name: "requestMessage",
    component: () => import("@/views/modules/request-message/index.vue"),
    meta: {
      title: "route.drawerComponents.requestMessage",
      icon: "message",
      group: "website",
      queryParam: "Request",
      roles: [Role.CS_ADMIN]
    }
  },
  {
    path: "/lisiting-config",
    name: "Listing",
    component: () => import("@/views/modules/website-config/content-config/index.vue"),
    meta: {
      title: "route.drawerComponents.listingContent",
      icon: "receipt_long",
      group: "website",
      queryParam: "Listing",
      roles: [Role.CS_ADMIN]
    }
  },
  {
    path: "/agent-content",
    name: "Agent",
    component: () => import("@/views/modules/website-config/content-config/index.vue"),
    meta: {
      title: "route.drawerComponents.agentContent",
      icon: "receipt_long",
      group: "website",
      queryParam: "Agent",
      roles: [Role.CS_ADMIN]
    }
  },
  {
    path: "/about-us",
    name: "About",
    component: () => import("@/views/modules/website-config/content-config/index.vue"),
    meta: {
      title: "route.drawerComponents.aboutUs",
      icon: "receipt_long",
      group: "website",
      queryParam: "About",
      roles: [Role.CS_ADMIN, Role.FRONT_DESK]
    }
  },
  {
    path: "/footer",
    name: "Footer",
    component: () => import("@/views/modules/website-config/footer/index.vue"),
    meta: {
      title: "route.drawerComponents.footer",
      icon: "copyright",
      group: "website",
      roles: [Role.CS_ADMIN, Role.FRONT_DESK]
    }
  }
];
