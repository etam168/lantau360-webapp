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

const iconVersion = "v=6";
const iconType = "icons";
const name = "Lantau360 Lite";

const pwaOptions: Partial<VitePWAOptions> = {
  mode: "development",
  base: "/",
  registerType: "prompt",
  injectRegister: "auto",
  includeAssets: ["favicon.svg"],
  manifest: {
    name: "Lantau360 Lite",
    short_name: "Lantau360",
    theme_color: "#ffffff",
    background_color: "#00652E",
    start_url: "/?source=pwa",
    display: "standalone",
    icons: [
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
      {
        urlPattern: /\/manifest\.webmanifest/,
        handler: "NetworkFirst",
        options: {
          cacheName: "manifest-cache",
          expiration: {
            maxEntries: 1,
            maxAgeSeconds: 60
          }
        }
      }
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
  esbuild: {
    drop: ["console", "debugger"]
  },
  build: {
    chunkSizeWarningLimit: 600,
    minify: "terser",
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true
      }
    }
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
      dirs: ["src/components/global"],
      extensions: ["vue"],
      dts: "src/components.d.ts"
    }),
    createHtmlPlugin({
      inject: {
        data: {
          injectAppleTouchIcons: `
            <link rel="apple-touch-icon" sizes="180x180" href="/resources/pwa/${iconType}/ios/apple-touch-icon.png?${iconVersion}">
            <link rel="apple-touch-icon" sizes="152x152" href="/resources/pwa/${iconType}/ios/touch-icon-ipad.png?${iconVersion}">
            <link rel="apple-touch-icon" sizes="180x180" href="/resources/pwa/${iconType}/ios/touch-icon-iphone-retina.png?${iconVersion}">
            <link rel="apple-touch-icon" sizes="167x167" href="/resources/pwa/${iconType}/ios/touch-icon-ipad-retina.png?${iconVersion}">
            <link rel="icon" type="image/png" sizes="32x32" href="/resources/pwa/${iconType}/favicon-32x32.png?${iconVersion}">
            <link rel="icon" type="image/png" sizes="16x16" href="/resources/pwa/${iconType}/favicon-16x16.png?${iconVersion}">
            <link rel="mask-icon" href="/resources/pwa/${iconType}/safari-pinned-tab.svg?${iconVersion}" color="#00652E">
            <meta name="msapplication-TileColor" content="#00652E">
            <meta name="theme-color" content="#ffffff">
          `,
          title: name,
          injectSplashScreen: `
            <link rel="apple-touch-startup-image" href="/resources/pwa/${iconType}/ios/apple-launch-640x1136.png?${iconVersion}" media="(device-width: 320px) and (device-height: 568px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)">
            <link rel="apple-touch-startup-image" href="/resources/pwa/${iconType}/ios/apple-launch-750x1334.png?${iconVersion}" media="(device-width: 375px) and (device-height: 667px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)">
            <link rel="apple-touch-startup-image" href="/resources/pwa/${iconType}/ios/apple-launch-1242x2208.png?${iconVersion}" media="(device-width: 414px) and (device-height: 736px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)">
            <link rel="apple-touch-startup-image" href="/resources/pwa/${iconType}/ios/apple-launch-1125x2436.png?${iconVersion}" media="(device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)">
            <link rel="apple-touch-startup-image" href="/resources/pwa/${iconType}/ios/apple-launch-1536x2048.png?${iconVersion}" media="(min-device-width: 768px) and (max-device-width: 1024px) and (-webkit-min-device-pixel-ratio: 2) and (orientation: portrait)">
            <link rel="apple-touch-startup-image" href="/resources/pwa/${iconType}/ios/apple-launch-1668x2224.png?${iconVersion}" media="(min-device-width: 834px) and (max-device-width: 834px) and (-webkit-min-device-pixel-ratio: 2) and (orientation: portrait)">
            <link rel="apple-touch-startup-image" href="/resources/pwa/${iconType}/ios/apple-launch-2048x2732.png?${iconVersion}" media="(min-device-width: 1024px) and (max-device-width: 1024px) and (-webkit-min-device-pixel-ratio: 2) and (orientation: portrait)">
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
