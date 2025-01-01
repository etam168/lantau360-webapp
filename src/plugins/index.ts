/**
 * plugins/index.ts
 *
 * Automatically included in `./src/main.ts`
 */

// Plugins
import { App } from "vue";
import i18n from "./i18n/i18n";

import { Quasar } from "quasar";
import quasarUserOptions from "./quasar/quasar-user-options";
import pinia from "@/stores";
import router from "@/router";
import veeValidate from "./vee-validate/index";
import Vue3QTelInput from "vue3-q-tel-input";
import InternetConnectionPlugin from "./internet-connection-plugin";
import "vue3-q-tel-input/dist/style.css";

export function registerPlugins(app: App) {
  app
    .use(i18n)
    .use(Quasar, quasarUserOptions)
    .use(pinia)
    .use(veeValidate)
    .use(Vue3QTelInput)
    .use(router)
    .use(InternetConnectionPlugin, router);
}

const importComponents = import.meta.glob("./**/*.vue");

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
