import { Role } from "@/constants";

export const administratorRoutes = [
  {
    path: "/members",
    name: "Members",
    component: () => import("@/views/modules/member/index.vue"),
    meta: {
      title: "route.drawerComponents.members",
      icon: "mdi-account-check",
      group: "manageUsers",
      roles: [Role.CS_ADMIN]
    }
  },
  {
    path: "/staff",
    name: "Staff",
    component: () => import("@/views/modules/staff/index.vue"),
    meta: {
      title: "route.drawerComponents.staff",
      icon: "mdi-account-multiple",
      group: "manageUsers",
      roles: [Role.CS_ADMIN]
    }
  },

  {
    path: "/directories",
    name: "Directories",
    component: () => import("@/views/modules/directory/index.vue"),
    meta: {
      title: "route.drawerComponents.directories",
      icon: "mdi-account-tie",
      group: "manageUsers",
      roles: [Role.CS_ADMIN, Role.FRONT_DESK]
    }
  },
  {
    path: "/weather",
    name: "Weather",
    component: () => import("@/views/modules/weather/index.vue"),
    meta: {
      title: "route.drawerComponents.weather",
      icon: "mdi-weather-partly-cloudy",
      group: "manageUsers",
      roles: [Role.CS_ADMIN, Role.FRONT_DESK]
    }
  },
  // {
  //   path: "/businesses",
  //   name: "Businesses",
  //   component: () => import("@/views/modules/business/index.vue"),
  //   meta: {
  //     title: "route.drawerComponents.business",
  //     icon: "mdi-briefcase-check",
  //     group: "manageUsers",
  //     roles: [Role.CS_ADMIN, Role.FRONT_DESK, Role.AGENT]
  //   }
  // },
  {
    path: "/sites",
    name: "Sites",
    component: () => import("@/views/modules/site/index.vue"),
    meta: {
      title: "route.drawerComponents.sites",
      icon: "mdi-google-maps",
      group: "manageUsers",
      roles: [Role.CS_ADMIN, Role.FRONT_DESK]
    }
  },
  {
    path: "/postings",
    name: "Postings",
    component: () => import("@/views/modules/posting/index.vue"),
    meta: {
      title: "route.drawerComponents.postings",
      icon: "edit_note",
      group: "manageUsers",
      roles: [Role.CS_ADMIN, Role.FRONT_DESK]
    }
  },

  {
    path: "/website-config",
    meta: {
      title: "route.drawerComponents.websiteConfig",
      icon: "language",
      group: "manageUsers",
      roles: [Role.CS_ADMIN, Role.FRONT_DESK]
    },
    children: [
      // {
      //   path: "/contact-us",
      //   name: "contactUs",
      //   component: () => import("@/views/modules/contact-us/index.vue"),
      //   meta: {
      //     title: "route.drawerComponents.contactUs",
      //     group: "manageUsers",
      //     queryParam: "ContactUs",
      //     roles: [Role.CS_ADMIN]
      //   }
      // },
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
      }
    ]
  }
];
