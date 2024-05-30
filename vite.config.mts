import dns from "dns";
import eslint from "vite-plugin-eslint";
import vue from "@vitejs/plugin-vue";
import AutoImport from "unplugin-auto-import/vite";
import Components from "unplugin-vue-components/vite";
import VueI18nPlugin from "@intlify/unplugin-vue-i18n/vite";
import { createHtmlPlugin } from "vite-plugin-html";
import { dirname, resolve } from "path";
import { quasar, transformAssetUrls } from "@quasar/vite-plugin";
import { defineConfig } from "vite";
import { fileURLToPath } from "url";
import { VitePWA, VitePWAOptions } from "vite-plugin-pwa";
import { version } from "./package.json";

dns.setDefaultResultOrder("verbatim");
const __dirname = dirname(fileURLToPath(import.meta.url));

const iconVersion = "v=6"; // Define your icon version here
const iconType = "old-icons";

const pwaOptions: Partial<VitePWAOptions> = {
  mode: "development",
  base: "/",
  registerType: "prompt",
  injectRegister: "auto",
  includeAssets: ["favicon.svg"], // Included assets
  manifest: {
    name: "Lantau360 Lite",
    short_name: "Lantau360L",
    theme_color: "#ffffff",
    background_color: "#00652E",
    start_url: "/?source=pwa",
    display: "standalone",
    icons: [
      // Android launcher icons
      {
        src: `./resources/pwa/${iconType}/android/android-launchericon-48-48.png?${iconVersion}`,
        sizes: "48x48",
        type: "image/png"
      },
      {
        src: `./resources/pwa/${iconType}/android/android-launchericon-72-72.png?${iconVersion}`,
        sizes: "72x72",
        type: "image/png"
      },
      {
        src: `./resources/pwa/${iconType}/android/android-launchericon-96-96.png?${iconVersion}`,
        sizes: "96x96",
        type: "image/png"
      },
      {
        src: `./resources/pwa/${iconType}/android/android-launchericon-144-144.png?${iconVersion}`,
        sizes: "144x144",
        type: "image/png"
      },
      {
        src: `./resources/pwa/${iconType}/android/android-launchericon-192-192.png?${iconVersion}`,
        sizes: "192x192",
        type: "image/png"
      },
      {
        src: `./resources/pwa/${iconType}/android/android-launchericon-512-512.png?${iconVersion}`,
        sizes: "512x512",
        type: "image/png"
      }
    ]
  },
  workbox: {
    // globPatterns: ["**/*.{js,css,html,ico,png,svg,json,woff2}"],
    // Selectively cache critical assets
    globPatterns: ["index.html", "manifest.webmanifest", "resources/pwa/*", "favicon.svg"],
    runtimeCaching: [
      {
        urlPattern: ({ url }) => url.pathname.startsWith("/resources/pwa/"),
        handler: "CacheFirst",
        options: {
          cacheName: "pwa-icons",
          expiration: {
            maxEntries: 10
          }
        }
      },
      // {
      //   urlPattern: /\/api\//,
      //   handler: "NetworkFirst",
      //   options: {
      //     cacheName: "api-cache",
      //     expiration: {
      //       maxEntries: 50,
      //       maxAgeSeconds: 5 * 60 // 5 Minutes
      //     }
      //   }
      // },
      {
        urlPattern: /\/manifest\.webmanifest/,
        handler: "NetworkFirst",
        options: {
          cacheName: "manifest-cache",
          expiration: {
            maxEntries: 1,
            maxAgeSeconds: 60 // 1 Day
          }
        }
      }
      // {
      //   urlPattern: /\.(?:png|jpg|jpeg|svg|gif)$/,
      //   handler: "CacheFirst",
      //   options: {
      //     cacheName: "image-cache",
      //     expiration: {
      //       maxEntries: 200,
      //       maxAgeSeconds: 30 * 24 * 60 * 60 // 30 Days
      //     }
      //   }
      // }
    ]
  },
  devOptions: {
    enabled: process.env.SW_DEV === "true",
    type: "module",
    navigateFallback: "index.html",
    suppressWarnings: true
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
        `
        }
      }
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
