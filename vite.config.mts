import dns from "dns";
import eslint from "vite-plugin-eslint";
import unpluginRemoveVite from "unplugin-remove/vite";
import vue from "@vitejs/plugin-vue";

import AutoImport from "unplugin-auto-import/vite";
import Components from "unplugin-vue-components/vite";
import VueI18nPlugin from "@intlify/unplugin-vue-i18n/vite";

import { createHtmlPlugin } from "vite-plugin-html";
import { dirname, resolve } from "path";
import { quasar, transformAssetUrls } from "@quasar/vite-plugin";
import { defineConfig } from "vite";
import { fileURLToPath } from "url";
import { VitePWA } from "vite-plugin-pwa";
import { pwaOptions } from "./vite.pwa";
import { version } from "./package.json";
import UnpluginTypia from "@ryoppippi/unplugin-typia/vite";
import path from "path";

dns.setDefaultResultOrder("verbatim");
const __dirname = dirname(fileURLToPath(import.meta.url));

const iconVersion = "v=6"; // Define your icon version here
const iconType = "icons";
const name = "Lantau360 Lite";

export default defineConfig({
  esbuild: {
    drop: ["console", "debugger"]
  },
  build: {
    chunkSizeWarningLimit: 600
  },
  plugins: [
    UnpluginTypia({}),
    vue({
      template: { transformAssetUrls }
    }),
    unpluginRemoveVite(),
    eslint(),
    VueI18nPlugin({
      include: resolve(__dirname, "./path/to/src/locales/**"),
      runtimeOnly: false
    }),
    quasar({
      sassVariables: "@/css/quasar.variables.scss"
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
    }),
    createHtmlPlugin({
      inject: {
        data: {
          injectAppleTouchIcons: `
            <link rel="apple-touch-icon" href="/resources/pwa/${iconType}/ios/60.png?${iconVersion}" sizes="60x60" />
            <link rel="apple-touch-icon" href="/resources/pwa/${iconType}/ios/76.png?${iconVersion}" sizes="76x76" />
            <link rel="apple-touch-icon" href="/resources/pwa/${iconType}/ios/120.png?${iconVersion}" sizes="120x120" />
            <link rel="apple-touch-icon" href="/resources/pwa/${iconType}/ios/152.png?${iconVersion}" sizes="152x152" />
            <link rel="apple-touch-icon" href="/resources/pwa/${iconType}/ios/180.png?${iconVersion}" sizes="180x180" />
            <link rel="apple-touch-icon" href="/resources/pwa/${iconType}/ios/512.png?${iconVersion}" />
        `,
          injectTitle: `
            <title>${name}</title>
        `
        }
      }
    })
  ],
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@import "src/css/quasar.variables.scss";`
      }
    }
  },
  define: {
    __APP_VERSION__: JSON.stringify(version)
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      src: path.resolve(__dirname, "./src")
    }
  },
  server: {
    port: 8080
  }
});
