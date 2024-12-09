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
  immediate: true, // Ensures immediate service worker registration

  onNeedRefresh() {
    Notify.create({
      message: t("notification.updateAvailable"),
      color: "info",
      position: "top",
      timeout: 0, // Set to 0 to prevent auto-dismiss
      actions: [
        {
          label: t("notification.refresh"),
          color: "white",
          handler: () => {
            updateSW(true); // Pass true to force update
          }
        },
        {
          label: t("common.dismiss"),
          color: "white",
          handler: () => {
            // Optional: Handle dismiss action
          }
        }
      ]
    });
  },

  //   // Just inform the user
  //   Notify.create({
  //     message: t("notification.updateAvailable"),
  //     color: "info",
  //     timeout: 2000,
  //     actions: [
  //       {
  //         label: t("notification.refresh"),
  //         color: "primary",
  //         handler: () => {
  //           updateSW(); // Trigger SW update
  //         }
  //       },
  //       { icon: "close", color: "white" }
  //     ]
  //   });
  //   updateSW();
  // },

  onOfflineReady() {
    // Notify.create({
    //   message: t("notification.workOffline"),
    //   color: "primary",
    //   timeout: 2000,
    //   actions: [{ icon: "close", color: "white" }]
    // });
  },

  onRegisteredSW(swUrl, r) {
    if (r) {
      setInterval(async () => {
        if (!r.installing && navigator) {
          // Check if the device is online
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
              // Fail silently for network errors
            }
          }
        }
      }, intervalMS);
    }
  }
});

// Detect if the app is launched as a PWA
document.addEventListener("DOMContentLoaded", () => {
  const urlParams = new URLSearchParams(window.location.search);
  const isPWA = urlParams.get("source") === "pwa";
  if (isPWA) {
    // Initialize PWA-specific logic if needed
  }
});

const app = createApp(App);
registerPlugins(app);
app.mount("#app");

// Expose updateSW function only in development mode
if (import.meta.env.DEV) {
  (window as any).updateSW = updateSW;
}
