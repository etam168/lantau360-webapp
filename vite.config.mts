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
    background_color: "#00652E",
    icons: [
      {
        src: "./resources/pwa/android-icon-192x192.png",
        sizes: "192x192",
        type: "image/png"
      },
      {
        src: "./resources/pwa/android-chrome-256x256.png",
        sizes: "256x256",
        type: "image/png"
      },
      {
        src: "./resources/pwa/android-icon-384x384.png",
        sizes: "72x72",
        type: "image/png"
      },
      {
        src: "./resources/pwa/android-icon-512x512.png",
        sizes: "512x512",
        type: "image/png"
      },
      // iOS icons
      {
        src: "/resources/pwa/apple-touch-icon-60x60.png",
        sizes: "60x60",
        type: "image/png"
      },
      {
        src: "/resources/pwa/apple-touch-icon-76x76.png",
        sizes: "76x76",
        type: "image/png"
      },
      {
        src: "/resources/pwa/apple-touch-icon-120x120.png",
        sizes: "120x120",
        type: "image/png"
      },
      {
        src: "/resources/pwa/apple-touch-icon-152x152.png",
        sizes: "152x152",
        type: "image/png"
      },
      {
        src: "/resources/pwa/apple-touch-icon-180x180.png",
        sizes: "180x180",
        type: "image/png"
      },
      {
        src: "/resources/pwa/apple-touch-icon.png",
        sizes: "any",
        type: "image/png"
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
    VitePWA(pwaOptions),
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
