import dns from "dns";
import eslintPlugin from "vite-plugin-eslint";
import vue from "@vitejs/plugin-vue";
import Components from "unplugin-vue-components/vite";
import VueI18nPlugin from "@intlify/unplugin-vue-i18n/vite";

import { dirname, resolve } from "path";
import { quasar, transformAssetUrls } from "@quasar/vite-plugin";
import { defineConfig } from "vite";
import { fileURLToPath } from "url";
import { VitePWA } from "vite-plugin-pwa";

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
    }),
    VitePWA({
      registerType: "autoUpdate",
      injectRegister: "auto",
      devOptions: {
        enabled: true,
        type: "module"
        /* other options */
      },
      workbox: {
        cleanupOutdatedCaches: false,
        globPatterns: ["**/*.{js,css,html,ico,png,svg,json,vue,txt,woff2}"]
      }
    }),
    Components({
      // relative paths to the directory to search for components.
      dirs: ["src/components/global"],

      // valid file extensions for components.
      extensions: ["vue"],

      dts: "src/components.d.ts" // enabled by default if `typescript` is installed
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
