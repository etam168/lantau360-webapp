import dns from "dns";
import eslint from "vite-plugin-eslint";
import vue from "@vitejs/plugin-vue";
import AutoImport from "unplugin-auto-import/vite";
import Components from "unplugin-vue-components/vite";
import VueI18nPlugin from "@intlify/unplugin-vue-i18n/vite";

import { dirname, resolve } from "path";
import { quasar, transformAssetUrls } from "@quasar/vite-plugin";
import { defineConfig } from "vite";
import { fileURLToPath } from "url";
import { VitePWA, VitePWAOptions } from "vite-plugin-pwa";
import { version } from "./package.json";

dns.setDefaultResultOrder("verbatim");
const __dirname = dirname(fileURLToPath(import.meta.url));

const pwaOptions: Partial<VitePWAOptions> = {
  mode: "development",
  base: "/",
  registerType: "prompt",
  injectRegister: "auto",
  includeAssets: ["favicon.svg"], // Included assets
  manifest: {
    name: "Lantau360 Lite",
    short_name: "Lantau360",
    theme_color: "#ffffff",
    icons: [
      {
        src: "pwa-192x192.png", // Path to the icon without leading slash
        sizes: "192x192",
        type: "image/png"
      },
      {
        src: "/pwa-512x512.png", // Path to the icon with leading slash
        sizes: "512x512",
        type: "image/png"
      },
      {
        src: "pwa-512x512.png", // Path to the icon without leading slash
        sizes: "512x512",
        type: "image/png",
        purpose: ["any", "maskable"] // Purpose declaration for the icon
      }
    ]
  },
  devOptions: {
    enabled: process.env.SW_DEV === "true",
    type: "module",
    navigateFallback: "index.html",
    suppressWarnings: true
  },
  workbox: {
    cleanupOutdatedCaches: false,
    globPatterns: ["**/*.{js,css,html,ico,png,svg,json,vue,txt,woff2}"]
  }
};

export default defineConfig({
  build: {
    chunkSizeWarningLimit: 600
  },
  plugins: [
    vue({
      template: { transformAssetUrls }
    }),
    eslint(),
    VueI18nPlugin({
      include: resolve(__dirname, "./path/to/src/locales/**"),
      runtimeOnly: false
    }),
    quasar({
      sassVariables: "src/css/quasar.variables.scss"
    }),
    VitePWA({
      ...pwaOptions,
      registerType: "autoUpdate",
      injectRegister: "auto",
      workbox: {
        cleanupOutdatedCaches: false,
        globPatterns: ["**/*.{js,css,html,ico,png,svg,json,vue,txt,woff2}"]
      }
    }),
    AutoImport({
      include: [/\.[tj]sx?$/, /\.vue$/, /\.vue\?vue/, /\.md$/],
      imports: [
        "quasar",
        "vue",
        "vue-router",
        "vue-i18n",
        "@vueuse/core",
        // Auto-import vue-i18n functions
        // {
        //   "vue-i18n": [
        //     // import { useI18n } from "vue-i18n"
        //     "useI18n" // if you're using Composition API
        //   ]
        // },
        {
          axios: [["default", "axios"], "AxiosError"]
        }
      ],
      dirs: ["src/composable/**"],
      dts: "src/auto-imports.d.ts",
      vueTemplate: true,
      resolvers: [],
      eslintrc: {
        enabled: true,
        filepath: "./.eslintrc-auto-import.json",
        globalsPropValue: true
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
  define: {
    __APP_VERSION__: JSON.stringify(version)
  },
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url))
    }
  },
  server: {
    port: 8080
  }
});
