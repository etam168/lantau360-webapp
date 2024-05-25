import { createApp } from "vue";

import { registerSW } from "virtual:pwa-register";
import { registerPlugins } from "@/plugins";
import { Dialog } from "quasar";

import App from "@/App.vue";
import "@/plugins/axios";
import "quasar/src/css/index.sass";

const intervalMS = 60 * 60 * 1000;

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

  onOfflineReady() {},
  onRegisteredSW(swUrl, r) {
    r &&
      setInterval(async () => {
        if (!(!r.installing && navigator)) return;

        if ("connection" in navigator && !navigator.onLine) return;

        const resp = await fetch(swUrl, {
          cache: "no-store",
          headers: {
            cache: "no-store",
            "cache-control": "no-cache"
          }
        });

        if (resp?.status === 200) await r.update();
      }, intervalMS);
  }
});

document.addEventListener("swUpdated", (event: any) => {
  const registration = event.detail;

  if (window.confirm("A new version is available. Do you want to refresh?")) {
    registration.waiting.postMessage({ type: "SKIP_WAITING" });
    // Optionally, you can force a page reload
    window.location.reload();
  }
});

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/sw.js", { scope: "/" });
  });
}
const app = createApp(App);
registerPlugins(app);
app.mount("#app");
