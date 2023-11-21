import { RouteRecordRaw } from "vue-router";

const authRouter: Array<RouteRecordRaw> = [
  {
    path: "/auth",
    alias: "/auth/login",
    component: () => import("@/views/auth/index.vue"),
    children: [
      {
        path: "/auth/login",
        component: () => import("@/views/auth/login.vue"),
        meta: {
          hidden: true
        }
      },
      // {
      //   path: "/auth/resetPassword",
      //   component: () => import("@/views/auth/reset-password-page.vue"),

      //   meta: {
      //     hidden: true,
      //     queryParam: "user"
      //   }
      // }
      {
        path: "/auth/resetPassword",
        component: () => import("@/views/auth/reset-password-page.vue"),

        meta: {
          hidden: true,
          queryParam: ["token", "username"]
        }
      }
    ]
  }
];

export default authRouter;
