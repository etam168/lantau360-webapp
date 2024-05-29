import { createApp } from "vue";
import { registerSW } from "virtual:pwa-register";
import { registerPlugins } from "@/plugins";
import { Dialog, Notify } from "quasar";
import i18n from "@/plugins/i18n/i18n";

import App from "@/App.vue";
import "@/plugins/axios";
import "quasar/src/css/index.sass";

const { t } = i18n.global;
// 1 hour
const intervalMS = 2 * 60 * 1000;

const updateSW = registerSW({
  onNeedRefresh() {
    Dialog.create({
      title: t("notification.updateAvailable"),
      message: t("notification.refreshApp"),
      ok: {
        label: "Refresh",
        color: "primary"
      },
      cancel: {
        label: "Cancel",
        color: "negative"
      }
    })
      .onOk(() => {
        updateSW();
      })
      .onCancel(() => {});
  },

  onOfflineReady() {
    Notify.create({
      message: t("notification.workOffline"),
      color: "primary",
      timeout: 10000,
      actions: [
        {
          icon: "close",
          color: "white",
          round: true,
          handler: () => {
            /* ... */
          }
        }
      ]
    });
  },

  onRegisteredSW(swUrl, r) {
    r &&
      setInterval(async () => {
        if (!(!r.installing && navigator)) return;

        if ("connection" in navigator && !navigator.onLine) return;

        try {
          const resp = await fetch(swUrl, {
            cache: "no-store",
            headers: {
              cache: "no-store",
              "cache-control": "no-cache"
            }
          });

          if (resp?.status === 200) await r.update();
        } catch (error) {
          console.error("Error fetching service worker script:", error);
        }
      }, intervalMS);
  }
});

// Check for PWA launch
document.addEventListener("DOMContentLoaded", () => {
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.has("source") && urlParams.get("source") === "pwa") {
    console.log("App launched as PWA");
    // Apply PWA-specific logic here
    // For example, hide the browser navigation bar
  }
});

const app = createApp(App);
registerPlugins(app);
app.mount("#app");

// Expose updateSW to the global scope for manual checking
(window as any).updateSW = updateSW;

// Trigger an update check when the app is launched
updateSW();
