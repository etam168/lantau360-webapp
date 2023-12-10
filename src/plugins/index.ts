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
// import { useUserStore } from "@/stores/user";
// import { usePermissionStore } from "@/stores/permission";

import router from "@/router";
import veeValidate from "./vee-validate/index";

// Types
import type { App } from "vue";

export function registerPlugins(app: App) {
  app.use(i18n).use(Quasar, quasarUserOptions).use(pinia).use(veeValidate);

  // const userStore = useUserStore(pinia);
  // if (userStore.token) {
  //   const permissionStore = usePermissionStore(pinia);
  //   permissionStore.GenerateRoutes({ roles: userStore.roles });
  // }

  app.use(router);
}

const importComponents = import.meta.glob("./**/*.vue");

// const changelogs = Object.values(import.meta.glob("~/changelogs/*.md", { eager: true, as: "raw" }))

export const registerComponents_2 = async (app: App<Element>): Promise<void> => {
  for (const fileName of Object.keys(importComponents)) {
    const componentConfig = await importComponents[fileName]();
    const componentName = fileName
      .split("/")
      .pop()
      ?.replace(/\.\w+$/, "") as string;

    app.component(componentName, (componentConfig as any)?.default);
  }
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const modules = import.meta.glob("@/components/global/*.vue", { eager: true });

// eslint-disable-next-line @typescript-eslint/no-unused-vars
// export function registerComponents(app: App) {
//   for (const path in modules) {
//     const componentName = path
//       .split("/")
//       .pop()
//       ?.replace(/\.\w+$/, "") as string;

//     //alert(componentName);
//     const componentConfig = modules[path];
//     app.component(`global-${componentName}`, (componentConfig as any)?.default);
//   }
// }
