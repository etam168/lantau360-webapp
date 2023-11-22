import { createApp } from "vue";

import App from "@/App.vue";
import "@/plugins/axios";

// ! Important: we need the src/css folder
import "quasar/src/css/index.sass";

// import { registerSW } from "virtual:pwa-register";

// const updateSW = registerSW({
//   onNeedRefresh() {
//     document.dispatchEvent(new CustomEvent("swUpdated", { detail: updateSW }));
//   }
// });

// Plugins
import { registerPlugins } from "@/plugins";
import "vue-tel-input/vue-tel-input.css";

const app = createApp(App);
registerPlugins(app);
app.mount("#app");
