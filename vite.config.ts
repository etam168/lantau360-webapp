import dns from "dns";
import eslintPlugin from "vite-plugin-eslint";
import vue from "@vitejs/plugin-vue";
import VueI18nPlugin from "@intlify/unplugin-vue-i18n/vite";
import { dirname, resolve } from "path";
import { quasar, transformAssetUrls } from "@quasar/vite-plugin";
import { defineConfig } from "vite";
import { fileURLToPath } from "url";

dns.setDefaultResultOrder("verbatim");
const __dirname = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  build: {
    chunkSizeWarningLimit: 600
  },
  plugins: [
    eslintPlugin(),
    vue({
      template: { transformAssetUrls }
    }),
    VueI18nPlugin({
      include: resolve(__dirname, "./path/to/src/locales/**"),
      runtimeOnly: false
    }),
    quasar({
      sassVariables: "src/css/quasar.variables.scss"
    })
  ],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url))
    }
  },
  server: {
    port: 8080
  }
});
