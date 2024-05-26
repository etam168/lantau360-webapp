import { createApp } from "vue";
import { registerSW } from "virtual:pwa-register";
import { registerPlugins } from "@/plugins";
import { Dialog } from "quasar";

import App from "@/App.vue";
import "@/plugins/axios";
import "quasar/src/css/index.sass";

// 1 hour
const intervalMS = 2 * 60 * 1000;

const updateSW = registerSW({
  onNeedRefresh() {
    Dialog.create({
      title: "Update Available",
      message: "A new version is available. Do you want to refresh?",
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
    console.log("The app is ready to work offline");
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
