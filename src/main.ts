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

// https://dev.to/jirehnimes/how-to-register-global-components-in-vue-3-dynamically-in-2023-1d50
// https://blog.logrocket.com/how-to-automatically-import-register-vue-components/
// https://blog.csdn.net/Liu_yunzhao/article/details/130181440
// https://www.sobyte.net/post/2022-05/unplugin-vue-components/

// Plugins
import { registerPlugins } from "@/plugins";

const app = createApp(App);
registerPlugins(app);
app.mount("#app");
