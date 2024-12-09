// vite.config.mts
import dns from "dns";
import eslint from "file:///E:/Projects/lantau/lantau360-webapp/node_modules/vite-plugin-eslint/dist/index.mjs";
import unpluginRemoveVite from "file:///E:/Projects/lantau/lantau360-webapp/node_modules/unplugin-remove/dist/vite.js";
import vue from "file:///E:/Projects/lantau/lantau360-webapp/node_modules/@vitejs/plugin-vue/dist/index.mjs";
import AutoImport from "file:///E:/Projects/lantau/lantau360-webapp/node_modules/unplugin-auto-import/dist/vite.js";
import Components from "file:///E:/Projects/lantau/lantau360-webapp/node_modules/unplugin-vue-components/dist/vite.js";
import VueI18nPlugin from "file:///E:/Projects/lantau/lantau360-webapp/node_modules/@intlify/unplugin-vue-i18n/lib/vite.mjs";
import { createHtmlPlugin } from "file:///E:/Projects/lantau/lantau360-webapp/node_modules/vite-plugin-html/dist/index.mjs";
import { dirname, resolve } from "path";
import { quasar, transformAssetUrls } from "file:///E:/Projects/lantau/lantau360-webapp/node_modules/@quasar/vite-plugin/src/index.js";
import { defineConfig } from "file:///E:/Projects/lantau/lantau360-webapp/node_modules/vite/dist/node/index.js";
import { fileURLToPath } from "url";
import { VitePWA } from "file:///E:/Projects/lantau/lantau360-webapp/node_modules/vite-plugin-pwa/dist/index.js";

// package.json
var version = "1.0.62";

// vite.config.mts
import UnpluginTypia from "file:///E:/Projects/lantau/lantau360-webapp/node_modules/@ryoppippi/unplugin-typia/src/vite.js";
import path from "path";
var __vite_injected_original_import_meta_url = "file:///E:/Projects/lantau/lantau360-webapp/vite.config.mts";
dns.setDefaultResultOrder("verbatim");
var __dirname = dirname(fileURLToPath(__vite_injected_original_import_meta_url));
var iconVersion = "v=6";
var iconType = "icons";
var name = "Lantau360 Lite";
var pwaOptions = {
  mode: "development",
  base: "/",
  registerType: "autoUpdate",
  injectRegister: "auto",
  includeAssets: ["favicon.svg"],
  // Included assets
  manifest: {
    name: "Lantau360 Lite",
    short_name: "Lantau360",
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
    // Add skipWaiting and clientsClaim for faster updates
    skipWaiting: true,
    clientsClaim: true,
    // globPatterns: ["**/*.{js,css,html,ico,png,svg,json,woff2}"],
    // Selectively cache critical assets
    globPatterns: ["index.html", "manifest.json",  "resources/pwa/*", "favicon.svg"],
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
            maxAgeSeconds: 24 * 60 * 60
            // 1 Day
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
var vite_config_default = defineConfig({
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
      dts: "src/components.d.ts"
      // enabled by default if `typescript` is installed
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
  // resolve: {
  //   alias: {
  //     "@": fileURLToPath(new URL("./src", import.meta.url))
  //   }
  // },
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
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcubXRzIiwgInBhY2thZ2UuanNvbiJdLAogICJzb3VyY2VzQ29udGVudCI6IFsiY29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2Rpcm5hbWUgPSBcIkU6XFxcXFByb2plY3RzXFxcXGxhbnRhdVxcXFxsYW50YXUzNjAtd2ViYXBwXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCJFOlxcXFxQcm9qZWN0c1xcXFxsYW50YXVcXFxcbGFudGF1MzYwLXdlYmFwcFxcXFx2aXRlLmNvbmZpZy5tdHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0U6L1Byb2plY3RzL2xhbnRhdS9sYW50YXUzNjAtd2ViYXBwL3ZpdGUuY29uZmlnLm10c1wiO2ltcG9ydCBkbnMgZnJvbSBcImRuc1wiO1xyXG5pbXBvcnQgZXNsaW50IGZyb20gXCJ2aXRlLXBsdWdpbi1lc2xpbnRcIjtcclxuaW1wb3J0IHVucGx1Z2luUmVtb3ZlVml0ZSBmcm9tIFwidW5wbHVnaW4tcmVtb3ZlL3ZpdGVcIjtcclxuaW1wb3J0IHZ1ZSBmcm9tIFwiQHZpdGVqcy9wbHVnaW4tdnVlXCI7XHJcblxyXG5pbXBvcnQgQXV0b0ltcG9ydCBmcm9tIFwidW5wbHVnaW4tYXV0by1pbXBvcnQvdml0ZVwiO1xyXG5pbXBvcnQgQ29tcG9uZW50cyBmcm9tIFwidW5wbHVnaW4tdnVlLWNvbXBvbmVudHMvdml0ZVwiO1xyXG5pbXBvcnQgVnVlSTE4blBsdWdpbiBmcm9tIFwiQGludGxpZnkvdW5wbHVnaW4tdnVlLWkxOG4vdml0ZVwiO1xyXG5cclxuaW1wb3J0IHsgY3JlYXRlSHRtbFBsdWdpbiB9IGZyb20gXCJ2aXRlLXBsdWdpbi1odG1sXCI7XHJcbmltcG9ydCB7IGRpcm5hbWUsIHJlc29sdmUgfSBmcm9tIFwicGF0aFwiO1xyXG5pbXBvcnQgeyBxdWFzYXIsIHRyYW5zZm9ybUFzc2V0VXJscyB9IGZyb20gXCJAcXVhc2FyL3ZpdGUtcGx1Z2luXCI7XHJcbmltcG9ydCB7IGRlZmluZUNvbmZpZyB9IGZyb20gXCJ2aXRlXCI7XHJcbmltcG9ydCB7IGZpbGVVUkxUb1BhdGggfSBmcm9tIFwidXJsXCI7XHJcbmltcG9ydCB7IFZpdGVQV0EsIFZpdGVQV0FPcHRpb25zIH0gZnJvbSBcInZpdGUtcGx1Z2luLXB3YVwiO1xyXG5pbXBvcnQgeyB2ZXJzaW9uIH0gZnJvbSBcIi4vcGFja2FnZS5qc29uXCI7XHJcbmltcG9ydCBVbnBsdWdpblR5cGlhIGZyb20gXCJAcnlvcHBpcHBpL3VucGx1Z2luLXR5cGlhL3ZpdGVcIjtcclxuaW1wb3J0IHBhdGggZnJvbSBcInBhdGhcIjtcclxuXHJcbmRucy5zZXREZWZhdWx0UmVzdWx0T3JkZXIoXCJ2ZXJiYXRpbVwiKTtcclxuY29uc3QgX19kaXJuYW1lID0gZGlybmFtZShmaWxlVVJMVG9QYXRoKGltcG9ydC5tZXRhLnVybCkpO1xyXG5cclxuY29uc3QgaWNvblZlcnNpb24gPSBcInY9NlwiOyAvLyBEZWZpbmUgeW91ciBpY29uIHZlcnNpb24gaGVyZVxyXG5jb25zdCBpY29uVHlwZSA9IFwiaWNvbnNcIjtcclxuY29uc3QgbmFtZSA9IFwiTGFudGF1MzYwIExpdGVcIjtcclxuXHJcbmNvbnN0IHB3YU9wdGlvbnM6IFBhcnRpYWw8Vml0ZVBXQU9wdGlvbnM+ID0ge1xyXG4gIG1vZGU6IFwiZGV2ZWxvcG1lbnRcIixcclxuICBiYXNlOiBcIi9cIixcclxuICByZWdpc3RlclR5cGU6IFwiYXV0b1VwZGF0ZVwiLFxyXG4gIGluamVjdFJlZ2lzdGVyOiBcImF1dG9cIixcclxuICBpbmNsdWRlQXNzZXRzOiBbXCJmYXZpY29uLnN2Z1wiXSwgLy8gSW5jbHVkZWQgYXNzZXRzXHJcbiAgbWFuaWZlc3Q6IHtcclxuICAgIG5hbWU6IFwiTGFudGF1MzYwIExpdGVcIixcclxuICAgIHNob3J0X25hbWU6IFwiTGFudGF1MzYwXCIsXHJcbiAgICB0aGVtZV9jb2xvcjogXCIjZmZmZmZmXCIsXHJcbiAgICBiYWNrZ3JvdW5kX2NvbG9yOiBcIiMwMDY1MkVcIixcclxuICAgIHN0YXJ0X3VybDogXCIvP3NvdXJjZT1wd2FcIixcclxuICAgIGRpc3BsYXk6IFwic3RhbmRhbG9uZVwiLFxyXG4gICAgaWNvbnM6IFtcclxuICAgICAgLy8gQW5kcm9pZCBsYXVuY2hlciBpY29uc1xyXG4gICAgICB7XHJcbiAgICAgICAgc3JjOiBgLi9yZXNvdXJjZXMvcHdhLyR7aWNvblR5cGV9L2FuZHJvaWQvYW5kcm9pZC1sYXVuY2hlcmljb24tNDgtNDgucG5nPyR7aWNvblZlcnNpb259YCxcclxuICAgICAgICBzaXplczogXCI0OHg0OFwiLFxyXG4gICAgICAgIHR5cGU6IFwiaW1hZ2UvcG5nXCJcclxuICAgICAgfSxcclxuICAgICAge1xyXG4gICAgICAgIHNyYzogYC4vcmVzb3VyY2VzL3B3YS8ke2ljb25UeXBlfS9hbmRyb2lkL2FuZHJvaWQtbGF1bmNoZXJpY29uLTcyLTcyLnBuZz8ke2ljb25WZXJzaW9ufWAsXHJcbiAgICAgICAgc2l6ZXM6IFwiNzJ4NzJcIixcclxuICAgICAgICB0eXBlOiBcImltYWdlL3BuZ1wiXHJcbiAgICAgIH0sXHJcbiAgICAgIHtcclxuICAgICAgICBzcmM6IGAuL3Jlc291cmNlcy9wd2EvJHtpY29uVHlwZX0vYW5kcm9pZC9hbmRyb2lkLWxhdW5jaGVyaWNvbi05Ni05Ni5wbmc/JHtpY29uVmVyc2lvbn1gLFxyXG4gICAgICAgIHNpemVzOiBcIjk2eDk2XCIsXHJcbiAgICAgICAgdHlwZTogXCJpbWFnZS9wbmdcIlxyXG4gICAgICB9LFxyXG4gICAgICB7XHJcbiAgICAgICAgc3JjOiBgLi9yZXNvdXJjZXMvcHdhLyR7aWNvblR5cGV9L2FuZHJvaWQvYW5kcm9pZC1sYXVuY2hlcmljb24tMTQ0LTE0NC5wbmc/JHtpY29uVmVyc2lvbn1gLFxyXG4gICAgICAgIHNpemVzOiBcIjE0NHgxNDRcIixcclxuICAgICAgICB0eXBlOiBcImltYWdlL3BuZ1wiXHJcbiAgICAgIH0sXHJcbiAgICAgIHtcclxuICAgICAgICBzcmM6IGAuL3Jlc291cmNlcy9wd2EvJHtpY29uVHlwZX0vYW5kcm9pZC9hbmRyb2lkLWxhdW5jaGVyaWNvbi0xOTItMTkyLnBuZz8ke2ljb25WZXJzaW9ufWAsXHJcbiAgICAgICAgc2l6ZXM6IFwiMTkyeDE5MlwiLFxyXG4gICAgICAgIHR5cGU6IFwiaW1hZ2UvcG5nXCJcclxuICAgICAgfSxcclxuICAgICAge1xyXG4gICAgICAgIHNyYzogYC4vcmVzb3VyY2VzL3B3YS8ke2ljb25UeXBlfS9hbmRyb2lkL2FuZHJvaWQtbGF1bmNoZXJpY29uLTUxMi01MTIucG5nPyR7aWNvblZlcnNpb259YCxcclxuICAgICAgICBzaXplczogXCI1MTJ4NTEyXCIsXHJcbiAgICAgICAgdHlwZTogXCJpbWFnZS9wbmdcIlxyXG4gICAgICB9XHJcbiAgICBdXHJcbiAgfSxcclxuICB3b3JrYm94OiB7XHJcbiAgICAvLyBBZGQgc2tpcFdhaXRpbmcgYW5kIGNsaWVudHNDbGFpbSBmb3IgZmFzdGVyIHVwZGF0ZXNcclxuICAgIHNraXBXYWl0aW5nOiB0cnVlLFxyXG4gICAgY2xpZW50c0NsYWltOiB0cnVlLFxyXG5cclxuICAgIC8vIGdsb2JQYXR0ZXJuczogW1wiKiovKi57anMsY3NzLGh0bWwsaWNvLHBuZyxzdmcsanNvbix3b2ZmMn1cIl0sXHJcbiAgICAvLyBTZWxlY3RpdmVseSBjYWNoZSBjcml0aWNhbCBhc3NldHNcclxuICAgIGdsb2JQYXR0ZXJuczogW1wiaW5kZXguaHRtbFwiLCBcIm1hbmlmZXN0LndlYm1hbmlmZXN0XCIsIFwicmVzb3VyY2VzL3B3YS8qXCIsIFwiZmF2aWNvbi5zdmdcIl0sXHJcbiAgICBydW50aW1lQ2FjaGluZzogW1xyXG4gICAgICB7XHJcbiAgICAgICAgdXJsUGF0dGVybjogKHsgdXJsIH0pID0+IHVybC5wYXRobmFtZS5zdGFydHNXaXRoKFwiL3Jlc291cmNlcy9wd2EvXCIpLFxyXG4gICAgICAgIGhhbmRsZXI6IFwiQ2FjaGVGaXJzdFwiLFxyXG4gICAgICAgIG9wdGlvbnM6IHtcclxuICAgICAgICAgIGNhY2hlTmFtZTogXCJwd2EtaWNvbnNcIixcclxuICAgICAgICAgIGV4cGlyYXRpb246IHtcclxuICAgICAgICAgICAgbWF4RW50cmllczogMTBcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgIH0sXHJcbiAgICAgIHtcclxuICAgICAgICB1cmxQYXR0ZXJuOiAvXFwvbWFuaWZlc3RcXC53ZWJtYW5pZmVzdC8sXHJcbiAgICAgICAgaGFuZGxlcjogXCJOZXR3b3JrRmlyc3RcIixcclxuICAgICAgICBvcHRpb25zOiB7XHJcbiAgICAgICAgICBjYWNoZU5hbWU6IFwibWFuaWZlc3QtY2FjaGVcIixcclxuICAgICAgICAgIGV4cGlyYXRpb246IHtcclxuICAgICAgICAgICAgbWF4RW50cmllczogMSxcclxuICAgICAgICAgICAgbWF4QWdlU2Vjb25kczogMjQgKiA2MCAqIDYwIC8vIDEgRGF5XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICAgIC8vIHtcclxuICAgICAgLy8gICB1cmxQYXR0ZXJuOiAvXFwuKD86cG5nfGpwZ3xqcGVnfHN2Z3xnaWYpJC8sXHJcbiAgICAgIC8vICAgaGFuZGxlcjogXCJDYWNoZUZpcnN0XCIsXHJcbiAgICAgIC8vICAgb3B0aW9uczoge1xyXG4gICAgICAvLyAgICAgY2FjaGVOYW1lOiBcImltYWdlLWNhY2hlXCIsXHJcbiAgICAgIC8vICAgICBleHBpcmF0aW9uOiB7XHJcbiAgICAgIC8vICAgICAgIG1heEVudHJpZXM6IDIwMCxcclxuICAgICAgLy8gICAgICAgbWF4QWdlU2Vjb25kczogMzAgKiAyNCAqIDYwICogNjAgLy8gMzAgRGF5c1xyXG4gICAgICAvLyAgICAgfVxyXG4gICAgICAvLyAgIH1cclxuICAgICAgLy8gfVxyXG4gICAgXVxyXG4gIH0sXHJcbiAgZGV2T3B0aW9uczoge1xyXG4gICAgZW5hYmxlZDogcHJvY2Vzcy5lbnYuU1dfREVWID09PSBcInRydWVcIixcclxuICAgIHR5cGU6IFwibW9kdWxlXCIsXHJcbiAgICBuYXZpZ2F0ZUZhbGxiYWNrOiBcImluZGV4Lmh0bWxcIixcclxuICAgIHN1cHByZXNzV2FybmluZ3M6IHRydWVcclxuICB9XHJcbn07XHJcblxyXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoe1xyXG4gIGVzYnVpbGQ6IHtcclxuICAgIGRyb3A6IFtcImNvbnNvbGVcIiwgXCJkZWJ1Z2dlclwiXVxyXG4gIH0sXHJcbiAgYnVpbGQ6IHtcclxuICAgIGNodW5rU2l6ZVdhcm5pbmdMaW1pdDogNjAwXHJcbiAgfSxcclxuICBwbHVnaW5zOiBbXHJcbiAgICBVbnBsdWdpblR5cGlhKHt9KSxcclxuICAgIHZ1ZSh7XHJcbiAgICAgIHRlbXBsYXRlOiB7IHRyYW5zZm9ybUFzc2V0VXJscyB9XHJcbiAgICB9KSxcclxuICAgIHVucGx1Z2luUmVtb3ZlVml0ZSgpLFxyXG4gICAgZXNsaW50KCksXHJcbiAgICBWdWVJMThuUGx1Z2luKHtcclxuICAgICAgaW5jbHVkZTogcmVzb2x2ZShfX2Rpcm5hbWUsIFwiLi9wYXRoL3RvL3NyYy9sb2NhbGVzLyoqXCIpLFxyXG4gICAgICBydW50aW1lT25seTogZmFsc2VcclxuICAgIH0pLFxyXG4gICAgcXVhc2FyKHtcclxuICAgICAgc2Fzc1ZhcmlhYmxlczogXCJAL2Nzcy9xdWFzYXIudmFyaWFibGVzLnNjc3NcIlxyXG4gICAgfSksXHJcblxyXG4gICAgVml0ZVBXQShwd2FPcHRpb25zKSxcclxuICAgIEF1dG9JbXBvcnQoe1xyXG4gICAgICBpbmNsdWRlOiBbL1xcLlt0al1zeD8kLywgL1xcLnZ1ZSQvLCAvXFwudnVlXFw/dnVlLywgL1xcLm1kJC9dLFxyXG4gICAgICBpbXBvcnRzOiBbXHJcbiAgICAgICAgXCJxdWFzYXJcIixcclxuICAgICAgICBcInZ1ZVwiLFxyXG4gICAgICAgIFwidnVlLXJvdXRlclwiLFxyXG4gICAgICAgIFwidnVlLWkxOG5cIixcclxuICAgICAgICBcIkB2dWV1c2UvY29yZVwiLFxyXG4gICAgICAgIHtcclxuICAgICAgICAgIGF4aW9zOiBbW1wiZGVmYXVsdFwiLCBcImF4aW9zXCJdLCBcIkF4aW9zRXJyb3JcIl1cclxuICAgICAgICB9XHJcbiAgICAgIF0sXHJcbiAgICAgIGRpcnM6IFtcInNyYy9jb21wb3NhYmxlLyoqXCJdLFxyXG4gICAgICBkdHM6IFwic3JjL2F1dG8taW1wb3J0cy5kLnRzXCIsXHJcbiAgICAgIHZ1ZVRlbXBsYXRlOiB0cnVlLFxyXG4gICAgICByZXNvbHZlcnM6IFtdLFxyXG4gICAgICBlc2xpbnRyYzoge1xyXG4gICAgICAgIGVuYWJsZWQ6IHRydWUsXHJcbiAgICAgICAgZmlsZXBhdGg6IFwiLi8uZXNsaW50cmMtYXV0by1pbXBvcnQuanNvblwiLFxyXG4gICAgICAgIGdsb2JhbHNQcm9wVmFsdWU6IHRydWVcclxuICAgICAgfVxyXG4gICAgfSksXHJcbiAgICBDb21wb25lbnRzKHtcclxuICAgICAgLy8gcmVsYXRpdmUgcGF0aHMgdG8gdGhlIGRpcmVjdG9yeSB0byBzZWFyY2ggZm9yIGNvbXBvbmVudHMuXHJcbiAgICAgIGRpcnM6IFtcInNyYy9jb21wb25lbnRzL2dsb2JhbFwiXSxcclxuXHJcbiAgICAgIC8vIHZhbGlkIGZpbGUgZXh0ZW5zaW9ucyBmb3IgY29tcG9uZW50cy5cclxuICAgICAgZXh0ZW5zaW9uczogW1widnVlXCJdLFxyXG5cclxuICAgICAgZHRzOiBcInNyYy9jb21wb25lbnRzLmQudHNcIiAvLyBlbmFibGVkIGJ5IGRlZmF1bHQgaWYgYHR5cGVzY3JpcHRgIGlzIGluc3RhbGxlZFxyXG4gICAgfSksXHJcbiAgICBjcmVhdGVIdG1sUGx1Z2luKHtcclxuICAgICAgaW5qZWN0OiB7XHJcbiAgICAgICAgZGF0YToge1xyXG4gICAgICAgICAgaW5qZWN0QXBwbGVUb3VjaEljb25zOiBgXHJcbiAgICAgICAgICAgIDxsaW5rIHJlbD1cImFwcGxlLXRvdWNoLWljb25cIiBocmVmPVwiL3Jlc291cmNlcy9wd2EvJHtpY29uVHlwZX0vaW9zLzYwLnBuZz8ke2ljb25WZXJzaW9ufVwiIHNpemVzPVwiNjB4NjBcIiAvPlxyXG4gICAgICAgICAgICA8bGluayByZWw9XCJhcHBsZS10b3VjaC1pY29uXCIgaHJlZj1cIi9yZXNvdXJjZXMvcHdhLyR7aWNvblR5cGV9L2lvcy83Ni5wbmc/JHtpY29uVmVyc2lvbn1cIiBzaXplcz1cIjc2eDc2XCIgLz5cclxuICAgICAgICAgICAgPGxpbmsgcmVsPVwiYXBwbGUtdG91Y2gtaWNvblwiIGhyZWY9XCIvcmVzb3VyY2VzL3B3YS8ke2ljb25UeXBlfS9pb3MvMTIwLnBuZz8ke2ljb25WZXJzaW9ufVwiIHNpemVzPVwiMTIweDEyMFwiIC8+XHJcbiAgICAgICAgICAgIDxsaW5rIHJlbD1cImFwcGxlLXRvdWNoLWljb25cIiBocmVmPVwiL3Jlc291cmNlcy9wd2EvJHtpY29uVHlwZX0vaW9zLzE1Mi5wbmc/JHtpY29uVmVyc2lvbn1cIiBzaXplcz1cIjE1MngxNTJcIiAvPlxyXG4gICAgICAgICAgICA8bGluayByZWw9XCJhcHBsZS10b3VjaC1pY29uXCIgaHJlZj1cIi9yZXNvdXJjZXMvcHdhLyR7aWNvblR5cGV9L2lvcy8xODAucG5nPyR7aWNvblZlcnNpb259XCIgc2l6ZXM9XCIxODB4MTgwXCIgLz5cclxuICAgICAgICAgICAgPGxpbmsgcmVsPVwiYXBwbGUtdG91Y2gtaWNvblwiIGhyZWY9XCIvcmVzb3VyY2VzL3B3YS8ke2ljb25UeXBlfS9pb3MvNTEyLnBuZz8ke2ljb25WZXJzaW9ufVwiIC8+XHJcbiAgICAgICAgYCxcclxuICAgICAgICAgIGluamVjdFRpdGxlOiBgXHJcbiAgICAgICAgICAgIDx0aXRsZT4ke25hbWV9PC90aXRsZT5cclxuICAgICAgICBgXHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9KVxyXG4gIF0sXHJcbiAgY3NzOiB7XHJcbiAgICBwcmVwcm9jZXNzb3JPcHRpb25zOiB7XHJcbiAgICAgIHNjc3M6IHtcclxuICAgICAgICBhZGRpdGlvbmFsRGF0YTogYEBpbXBvcnQgXCJzcmMvY3NzL3F1YXNhci52YXJpYWJsZXMuc2Nzc1wiO2BcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH0sXHJcbiAgZGVmaW5lOiB7XHJcbiAgICBfX0FQUF9WRVJTSU9OX186IEpTT04uc3RyaW5naWZ5KHZlcnNpb24pXHJcbiAgfSxcclxuICAvLyByZXNvbHZlOiB7XHJcbiAgLy8gICBhbGlhczoge1xyXG4gIC8vICAgICBcIkBcIjogZmlsZVVSTFRvUGF0aChuZXcgVVJMKFwiLi9zcmNcIiwgaW1wb3J0Lm1ldGEudXJsKSlcclxuICAvLyAgIH1cclxuICAvLyB9LFxyXG4gIHJlc29sdmU6IHtcclxuICAgIGFsaWFzOiB7XHJcbiAgICAgIFwiQFwiOiBwYXRoLnJlc29sdmUoX19kaXJuYW1lLCBcIi4vc3JjXCIpLFxyXG4gICAgICBzcmM6IHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsIFwiLi9zcmNcIilcclxuICAgIH1cclxuICB9LFxyXG4gIHNlcnZlcjoge1xyXG4gICAgcG9ydDogODA4MFxyXG4gIH1cclxufSk7XHJcbiIsICJ7XHJcbiAgXCJuYW1lXCI6IFwibGFudGF1MzYwLXdlYmFwcFwiLFxyXG4gIFwidmVyc2lvblwiOiBcIjEuMC42MlwiLFxyXG4gIFwicHJpdmF0ZVwiOiB0cnVlLFxyXG4gIFwidHlwZVwiOiBcIm1vZHVsZVwiLFxyXG4gIFwic2NyaXB0c1wiOiB7XHJcbiAgICBcImRldlwiOiBcInZpdGVcIixcclxuICAgIFwiYnVpbGRcIjogXCJ2aXRlIGJ1aWxkXCIsXHJcbiAgICBcImJ1aWxkLXRzY1wiOiBcInZ1ZS10c2MgLS1ub0VtaXQgJiYgdml0ZSBidWlsZFwiLFxyXG4gICAgXCJzZXJ2ZVwiOiBcInZpdGUgcHJldmlld1wiLFxyXG4gICAgXCJsaW50XCI6IFwiZXNsaW50IC0tZXh0IC5qcywudHMsLnZ1ZSAtLWlnbm9yZS1wYXRoIC5naXRpZ25vcmUgLS1maXggc3JjXCIsXHJcbiAgICBcImZvcm1hdFwiOiBcInByZXR0aWVyIC4gLS13cml0ZVwiLFxyXG4gICAgXCJwcmVwYXJlXCI6IFwidHMtcGF0Y2ggaW5zdGFsbCAmJiB0eXBpYSBwYXRjaFwiXHJcbiAgfSxcclxuICBcImRlcGVuZGVuY2llc1wiOiB7XHJcbiAgICBcIkBxdWFzYXIvZXh0cmFzXCI6IFwiXjEuMTYuMTNcIixcclxuICAgIFwiQHZlZS12YWxpZGF0ZS9ydWxlc1wiOiBcIl40LjE0LjdcIixcclxuICAgIFwiQHZlZS12YWxpZGF0ZS95dXBcIjogXCJeNC4xNC43XCIsXHJcbiAgICBcIkB2dWUtbGVhZmxldC92dWUtbGVhZmxldFwiOiBcIl4wLjEwLjFcIixcclxuICAgIFwiQHZ1ZS1zdHJpcGUvdnVlLXN0cmlwZVwiOiBcIl40LjUuMFwiLFxyXG4gICAgXCJAdnVldXNlL2NvcmVcIjogXCJeMTEuMi4wXCIsXHJcbiAgICBcIkB2dWV1c2UvaW50ZWdyYXRpb25zXCI6IFwiMTEuMi4wXCIsXHJcbiAgICBcImF4aW9zXCI6IFwiXjEuNy43XCIsXHJcbiAgICBcImNoYW5nZS1jYXNlXCI6IFwiXjUuNC40XCIsXHJcbiAgICBcImxlYWZsZXRcIjogXCJeMS45LjRcIixcclxuICAgIFwicGluaWFcIjogXCJeMi4yLjZcIixcclxuICAgIFwicGluaWEtcGx1Z2luLXBlcnNpc3RlZHN0YXRlXCI6IFwiXjQuMS4zXCIsXHJcbiAgICBcInF1YXNhclwiOiBcIl4yLjE3LjRcIixcclxuICAgIFwidHlwaWFcIjogXCJeNi4xMi4wXCIsXHJcbiAgICBcInZlZS12YWxpZGF0ZVwiOiBcIl40LjE0LjdcIixcclxuICAgIFwidnVlXCI6IFwiXjMuNS4xM1wiLFxyXG4gICAgXCJ2dWUtZHJhZ2dhYmxlLXBsdXNcIjogXCJeMC42LjBcIixcclxuICAgIFwidnVlLWkxOG5cIjogXCJeMTAuMC40XCIsXHJcbiAgICBcInZ1ZS1yb3V0ZXJcIjogXCJeNC40LjVcIixcclxuICAgIFwidnVlMy1xLXRlbC1pbnB1dFwiOiBcIl4yLjAuNFwiLFxyXG4gICAgXCJ5dXBcIjogXCJeMS40LjBcIlxyXG4gIH0sXHJcbiAgXCJkZXZEZXBlbmRlbmNpZXNcIjoge1xyXG4gICAgXCJAaW50bGlmeS91bnBsdWdpbi12dWUtaTE4blwiOiBcIl42LjAuMFwiLFxyXG4gICAgXCJAcXVhc2FyL3ZpdGUtcGx1Z2luXCI6IFwiXjEuOC4xXCIsXHJcbiAgICBcIkByeW9wcGlwcGkvdW5wbHVnaW4tdHlwaWFcIjogXCJeMS4wLjdcIixcclxuICAgIFwiQHR5cGVzL2xlYWZsZXRcIjogXCJeMS45LjE0XCIsXHJcbiAgICBcIkB0eXBlcy9ub2RlXCI6IFwiXjIyLjkuMFwiLFxyXG4gICAgXCJAdHlwZXMvdnVlLXRlbC1pbnB1dFwiOiBcIl4yLjEuN1wiLFxyXG4gICAgXCJAdHlwZXNjcmlwdC1lc2xpbnQvZXNsaW50LXBsdWdpblwiOiBcIl44LjE1LjBcIixcclxuICAgIFwiQHR5cGVzY3JpcHQtZXNsaW50L3BhcnNlclwiOiBcIl44LjE1LjBcIixcclxuICAgIFwiQHZpdGVqcy9wbHVnaW4tdnVlXCI6IFwiXjUuMi4wXCIsXHJcbiAgICBcIkB2dWUvZXNsaW50LWNvbmZpZy1wcmV0dGllclwiOiBcIl4xMC4xLjBcIixcclxuICAgIFwiQHZ1ZS9lc2xpbnQtY29uZmlnLXR5cGVzY3JpcHRcIjogXCJeMTQuMS4zXCIsXHJcbiAgICBcImVzbGludFwiOiBcIl45LjE1LjBcIixcclxuICAgIFwiZXNsaW50LWNvbmZpZy1wcmV0dGllclwiOiBcIl45LjEuMFwiLFxyXG4gICAgXCJlc2xpbnQtcGx1Z2luLXByZXR0aWVyXCI6IFwiXjUuMi4xXCIsXHJcbiAgICBcImVzbGludC1wbHVnaW4tdnVlXCI6IFwiXjkuMzEuMFwiLFxyXG4gICAgXCJwcmV0dGllclwiOiBcIl4zLjMuM1wiLFxyXG4gICAgXCJzYXNzXCI6IFwiXjEuODEuMFwiLFxyXG4gICAgXCJ0cy1wYXRjaFwiOiBcIl4zLjIuMVwiLFxyXG4gICAgXCJ0eXBlc2NyaXB0XCI6IFwiNS42LjNcIixcclxuICAgIFwidW5wbHVnaW4tYXV0by1pbXBvcnRcIjogXCJeMC4xOC41XCIsXHJcbiAgICBcInVucGx1Z2luLXJlbW92ZVwiOiBcIl4xLjAuM1wiLFxyXG4gICAgXCJ1bnBsdWdpbi12dWUtY29tcG9uZW50c1wiOiBcIl4wLjI3LjRcIixcclxuICAgIFwidW5wbHVnaW4tdnVlLXJvdXRlclwiOiBcIl4wLjEwLjhcIixcclxuICAgIFwidml0ZVwiOiBcIl41LjQuMTFcIixcclxuICAgIFwidml0ZS1wbHVnaW4tZXNsaW50XCI6IFwiXjEuOC4xXCIsXHJcbiAgICBcInZpdGUtcGx1Z2luLWh0bWxcIjogXCJeMy4yLjJcIixcclxuICAgIFwidml0ZS1wbHVnaW4tcHdhXCI6IFwiXjAuMjEuMFwiLFxyXG4gICAgXCJ2dWUtZXNsaW50LXBhcnNlclwiOiBcIl45LjQuM1wiLFxyXG4gICAgXCJ2dWUtdHNjXCI6IFwiXjIuMS4xMFwiXHJcbiAgfSxcclxuICBcInBhY2thZ2VNYW5hZ2VyXCI6IFwieWFybkA0LjUuMVwiXHJcbn1cclxuIl0sCiAgIm1hcHBpbmdzIjogIjtBQUFxUyxPQUFPLFNBQVM7QUFDclQsT0FBTyxZQUFZO0FBQ25CLE9BQU8sd0JBQXdCO0FBQy9CLE9BQU8sU0FBUztBQUVoQixPQUFPLGdCQUFnQjtBQUN2QixPQUFPLGdCQUFnQjtBQUN2QixPQUFPLG1CQUFtQjtBQUUxQixTQUFTLHdCQUF3QjtBQUNqQyxTQUFTLFNBQVMsZUFBZTtBQUNqQyxTQUFTLFFBQVEsMEJBQTBCO0FBQzNDLFNBQVMsb0JBQW9CO0FBQzdCLFNBQVMscUJBQXFCO0FBQzlCLFNBQVMsZUFBK0I7OztBQ1p0QyxjQUFXOzs7QURjYixPQUFPLG1CQUFtQjtBQUMxQixPQUFPLFVBQVU7QUFqQnFLLElBQU0sMkNBQTJDO0FBbUJ2TyxJQUFJLHNCQUFzQixVQUFVO0FBQ3BDLElBQU0sWUFBWSxRQUFRLGNBQWMsd0NBQWUsQ0FBQztBQUV4RCxJQUFNLGNBQWM7QUFDcEIsSUFBTSxXQUFXO0FBQ2pCLElBQU0sT0FBTztBQUViLElBQU0sYUFBc0M7QUFBQSxFQUMxQyxN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
