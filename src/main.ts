import { createApp } from "vue";

import { registerSW } from "virtual:pwa-register";
import { registerPlugins } from "@/plugins";
import { Dialog } from "quasar";

import App from "@/App.vue";
import "@/plugins/axios";
import "quasar/src/css/index.sass";

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

  onOfflineReady() {}
});

document.addEventListener("swUpdated", (event: any) => {
  const registration = event.detail;

  if (window.confirm("A new version is available. Do you want to refresh?")) {
    registration.waiting.postMessage({ type: "SKIP_WAITING" });
    // Optionally, you can force a page reload
    window.location.reload();
  }
});

const app = createApp(App);
registerPlugins(app);
app.mount("#app");
