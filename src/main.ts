import { createApp } from "vue";
import { registerSW } from "virtual:pwa-register";
import { registerPlugins } from "@/plugins";
import { Notify } from "quasar";
import i18n from "@/plugins/i18n/i18n";

import App from "@/App.vue";
import "@/plugins/axios";
import "quasar/src/css/index.sass";

const { t } = i18n.global;

// Check for updates every 2 minutes
const intervalMS = 2 * 60 * 1000;

const updateSW = registerSW({
  // ADDED: Immediate update handling
  immediate: true,

  onNeedRefresh() {
    // Dialog.create({
    //   title: t("notification.updateAvailable"),
    //   message: t("notification.refreshApp"),
    //   ok: { label: "Refresh", color: "primary" },
    //   cancel: { label: "Cancel", color: "negative" }
    // })
    //   .onOk(() => {
    //     updateSW();
    //   })
    //   .onCancel(() => {});

    // Just inform the user
    Notify.create({
      message: "New content available, updating...",
      color: "info",
      timeout: 2000,
      actions: [{ icon: "close", color: "white" }]
    });
  },

  onOfflineReady() {
    // Notify.create({
    //   message: t("notification.workOffline"),
    //   color: "primary",
    //   timeout: 10000,
    //   actions: [
    //     {
    //       icon: "close",
    //       color: "white",
    //       round: true,
    //       handler: () => {
    //         /* ... */
    //       }
    //     }
    //   ]
    // });

    Notify.create({
      message: t("notification.workOffline"),
      color: "primary",
      timeout: 2000,
      actions: [{ icon: "close", color: "white" }]
    });
  },

  onRegisteredSW(swUrl, r) {
    r &&
      setInterval(async () => {
        // if (!(!r.installing && navigator)) return;

        // if ("connection" in navigator && !navigator.onLine) return;

        // try {
        //   const resp = await fetch(swUrl, {
        //     cache: "no-store",
        //     headers: {
        //       cache: "no-store",
        //       "cache-control": "no-cache"
        //     }
        //   });

        //   if (resp?.status === 200) await r.update();
        // } catch (error: any) {
        //   //
        // }

        if (!r.installing && navigator) {
          // ADDED: Better online check
          if (!("connection" in navigator) || navigator.onLine) {
            try {
              const resp = await fetch(swUrl, {
                cache: "no-store",
                headers: {
                  cache: "no-store",
                  "cache-control": "no-cache"
                }
              });

              if (resp?.status === 200) {
                await r.update();
              }
            } catch (error) {
              // IMPROVED: Silent fail for network errors
            }
          }
        }
      }, intervalMS);
  }
});

// Check for PWA launch
document.addEventListener("DOMContentLoaded", () => {
  const urlParams = new URLSearchParams(window.location.search);
  // if (urlParams.has("source") && urlParams.get("source") === "pwa") {
  //   // console.log("App launched as PWA");
  //   // Apply PWA-specific logic here
  //   // For example, hide the browser navigation bar
  // }

  const isPWA = urlParams.get("source") === "pwa";
  if (isPWA) {
    // PWA-specific initialization if needed
  }
});

const app = createApp(App);
registerPlugins(app);
app.mount("#app");

// CHANGED: Only expose updateSW in development
if (import.meta.env.DEV) {
  (window as any).updateSW = updateSW;
}
