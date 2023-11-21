/**
 * plugins/index.ts
 *
 * Automatically included in `./src/main.ts`
 */

// Plugins
import i18n from "./i18n/i18n";

import { Quasar } from "quasar";
import quasarUserOptions from "./quasar/quasar-user-options";

import pinia from "@/stores";
import { useUserStore } from "@/stores/user";
import { usePermissionStore } from "@/stores/permission";

import router from "@/router";
import veeValidate from "./vee-validate/index";

// Types
import type { App } from "vue";

export function registerPlugins(app: App) {
  app.use(i18n).use(Quasar, quasarUserOptions).use(pinia).use(veeValidate);

  const userStore = useUserStore(pinia);
  if (userStore.token) {
    const permissionStore = usePermissionStore(pinia);
    permissionStore.GenerateRoutes({ roles: userStore.roles });
  }

  app.use(router);
}
