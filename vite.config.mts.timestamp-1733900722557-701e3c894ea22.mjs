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

// vite.pwa.ts
var pwaOptions = {
  mode: "production",
  base: "/",
  registerType: "prompt",
  injectRegister: "script",
  includeAssets: ["favicon.svg"],
  manifest: {
    id: "/?homescreen=1",
    name: "Lantau360 Lite",
    short_name: "Lantau360",
    theme_color: "#a06ded",
    background_color: "#00652E",
    start_url: "/?source=pwa&v=1.0.1",
    // Include version in start_url
    display: "standalone",
    icons: [
      {
        src: "./resources/pwa/icons/android/android-launchericon-48-48.png?v=6",
        sizes: "48x48",
        type: "image/png"
      },
      {
        src: "./resources/pwa/icons/android/android-launchericon-72-72.png?v=6",
        sizes: "72x72",
        type: "image/png"
      },
      {
        src: "./resources/pwa/icons/android/android-launchericon-96-96.png?v=6",
        sizes: "96x96",
        type: "image/png"
      },
      {
        src: "./resources/pwa/icons/android/android-launchericon-144-144.png?v=6",
        sizes: "144x144",
        type: "image/png"
      },
      {
        src: "./resources/pwa/icons/android/android-launchericon-192-192.png?v=6",
        sizes: "192x192",
        type: "image/png"
      },
      {
        src: "./resources/pwa/icons/android/android-launchericon-512-512.png?v=6",
        sizes: "512x512",
        type: "image/png"
      }
    ]
  },
  workbox: {
    cleanupOutdatedCaches: true,
    skipWaiting: false,
    clientsClaim: true,
    globPatterns: [
      "**/*.{js,css,html,ico,png,svg,json,woff2,webp}",
      "index.html",
      "manifest.json",
      "resources/pwa/*"
    ],
    navigateFallback: "index.html",
    navigateFallbackAllowlist: [/^(?!\/__).*/],
    runtimeCaching: [
      {
        urlPattern: ({ url }) => url.pathname.startsWith("/resources/pwa/"),
        handler: "StaleWhileRevalidate",
        options: {
          cacheName: "pwa-assets",
          expiration: {
            maxEntries: 20,
            maxAgeSeconds: 60 * 60
            // 1 hour
          },
          cacheableResponse: {
            statuses: [0, 200]
          }
        }
      },
      {
        urlPattern: /\.(?:js|css)$/i,
        handler: "StaleWhileRevalidate",
        options: {
          cacheName: "static-resources",
          expiration: {
            maxEntries: 100,
            maxAgeSeconds: 60 * 60
            // 1 hour
          },
          cacheableResponse: {
            statuses: [0, 200]
          }
        }
      },
      {
        urlPattern: /\/manifest\.json/,
        // Matches requests for manifest.json
        handler: "NetworkFirst",
        options: {
          cacheName: "manifest-cache",
          networkTimeoutSeconds: 3,
          expiration: {
            maxEntries: 1,
            maxAgeSeconds: 0
          },
          cacheableResponse: {
            statuses: [0, 200]
          },
          matchOptions: {
            ignoreSearch: false
          }
        }
      },
      {
        urlPattern: /^https:\/\/api(-dev)?\.lantau360\.com\/.*$/,
        handler: "NetworkFirst",
        options: {
          cacheName: "api-cache",
          networkTimeoutSeconds: 5,
          expiration: {
            maxEntries: 100,
            maxAgeSeconds: 60
            // 1 minute
          },
          cacheableResponse: {
            statuses: [0, 200]
          },
          matchOptions: {
            ignoreSearch: true
          }
        }
      },
      {
        urlPattern: /^https:\/\/(?:[a-z]\.)?tile\.openstreetmap\.org\/\d+\/\d+\/\d+\.png$/,
        handler: "CacheFirst",
        options: {
          cacheName: "map-cache",
          expiration: {
            maxEntries: 1e3
          },
          cacheableResponse: {
            statuses: [0, 200]
          },
          matchOptions: {
            ignoreSearch: true
          }
        }
      }
    ]
  },
  devOptions: {
    enabled: true,
    type: "module",
    navigateFallback: "index.html",
    suppressWarnings: true
  }
};

// package.json
var version = "1.0.75";

// vite.config.mts
import UnpluginTypia from "file:///E:/Projects/lantau/lantau360-webapp/node_modules/@ryoppippi/unplugin-typia/src/vite.js";
import path from "path";
var __vite_injected_original_import_meta_url = "file:///E:/Projects/lantau/lantau360-webapp/vite.config.mts";
dns.setDefaultResultOrder("verbatim");
var __dirname = dirname(fileURLToPath(__vite_injected_original_import_meta_url));
var iconVersion = "v=6";
var iconType = "icons";
var name = "Lantau360 Lite";
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
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcubXRzIiwgInZpdGUucHdhLnRzIiwgInBhY2thZ2UuanNvbiJdLAogICJzb3VyY2VzQ29udGVudCI6IFsiY29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2Rpcm5hbWUgPSBcIkU6XFxcXFByb2plY3RzXFxcXGxhbnRhdVxcXFxsYW50YXUzNjAtd2ViYXBwXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCJFOlxcXFxQcm9qZWN0c1xcXFxsYW50YXVcXFxcbGFudGF1MzYwLXdlYmFwcFxcXFx2aXRlLmNvbmZpZy5tdHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0U6L1Byb2plY3RzL2xhbnRhdS9sYW50YXUzNjAtd2ViYXBwL3ZpdGUuY29uZmlnLm10c1wiO2ltcG9ydCBkbnMgZnJvbSBcImRuc1wiO1xyXG5pbXBvcnQgZXNsaW50IGZyb20gXCJ2aXRlLXBsdWdpbi1lc2xpbnRcIjtcclxuaW1wb3J0IHVucGx1Z2luUmVtb3ZlVml0ZSBmcm9tIFwidW5wbHVnaW4tcmVtb3ZlL3ZpdGVcIjtcclxuaW1wb3J0IHZ1ZSBmcm9tIFwiQHZpdGVqcy9wbHVnaW4tdnVlXCI7XHJcblxyXG5pbXBvcnQgQXV0b0ltcG9ydCBmcm9tIFwidW5wbHVnaW4tYXV0by1pbXBvcnQvdml0ZVwiO1xyXG5pbXBvcnQgQ29tcG9uZW50cyBmcm9tIFwidW5wbHVnaW4tdnVlLWNvbXBvbmVudHMvdml0ZVwiO1xyXG5pbXBvcnQgVnVlSTE4blBsdWdpbiBmcm9tIFwiQGludGxpZnkvdW5wbHVnaW4tdnVlLWkxOG4vdml0ZVwiO1xyXG5cclxuaW1wb3J0IHsgY3JlYXRlSHRtbFBsdWdpbiB9IGZyb20gXCJ2aXRlLXBsdWdpbi1odG1sXCI7XHJcbmltcG9ydCB7IGRpcm5hbWUsIHJlc29sdmUgfSBmcm9tIFwicGF0aFwiO1xyXG5pbXBvcnQgeyBxdWFzYXIsIHRyYW5zZm9ybUFzc2V0VXJscyB9IGZyb20gXCJAcXVhc2FyL3ZpdGUtcGx1Z2luXCI7XHJcbmltcG9ydCB7IGRlZmluZUNvbmZpZyB9IGZyb20gXCJ2aXRlXCI7XHJcbmltcG9ydCB7IGZpbGVVUkxUb1BhdGggfSBmcm9tIFwidXJsXCI7XHJcbmltcG9ydCB7IFZpdGVQV0EgfSBmcm9tIFwidml0ZS1wbHVnaW4tcHdhXCI7XHJcbmltcG9ydCB7IHB3YU9wdGlvbnMgfSBmcm9tIFwiLi92aXRlLnB3YVwiO1xyXG5pbXBvcnQgeyB2ZXJzaW9uIH0gZnJvbSBcIi4vcGFja2FnZS5qc29uXCI7XHJcbmltcG9ydCBVbnBsdWdpblR5cGlhIGZyb20gXCJAcnlvcHBpcHBpL3VucGx1Z2luLXR5cGlhL3ZpdGVcIjtcclxuaW1wb3J0IHBhdGggZnJvbSBcInBhdGhcIjtcclxuXHJcbmRucy5zZXREZWZhdWx0UmVzdWx0T3JkZXIoXCJ2ZXJiYXRpbVwiKTtcclxuY29uc3QgX19kaXJuYW1lID0gZGlybmFtZShmaWxlVVJMVG9QYXRoKGltcG9ydC5tZXRhLnVybCkpO1xyXG5cclxuY29uc3QgaWNvblZlcnNpb24gPSBcInY9NlwiOyAvLyBEZWZpbmUgeW91ciBpY29uIHZlcnNpb24gaGVyZVxyXG5jb25zdCBpY29uVHlwZSA9IFwiaWNvbnNcIjtcclxuY29uc3QgbmFtZSA9IFwiTGFudGF1MzYwIExpdGVcIjtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZyh7XHJcbiAgZXNidWlsZDoge1xyXG4gICAgZHJvcDogW1wiY29uc29sZVwiLCBcImRlYnVnZ2VyXCJdXHJcbiAgfSxcclxuICBidWlsZDoge1xyXG4gICAgY2h1bmtTaXplV2FybmluZ0xpbWl0OiA2MDBcclxuICB9LFxyXG4gIHBsdWdpbnM6IFtcclxuICAgIFVucGx1Z2luVHlwaWEoe30pLFxyXG4gICAgdnVlKHtcclxuICAgICAgdGVtcGxhdGU6IHsgdHJhbnNmb3JtQXNzZXRVcmxzIH1cclxuICAgIH0pLFxyXG4gICAgdW5wbHVnaW5SZW1vdmVWaXRlKCksXHJcbiAgICBlc2xpbnQoKSxcclxuICAgIFZ1ZUkxOG5QbHVnaW4oe1xyXG4gICAgICBpbmNsdWRlOiByZXNvbHZlKF9fZGlybmFtZSwgXCIuL3BhdGgvdG8vc3JjL2xvY2FsZXMvKipcIiksXHJcbiAgICAgIHJ1bnRpbWVPbmx5OiBmYWxzZVxyXG4gICAgfSksXHJcbiAgICBxdWFzYXIoe1xyXG4gICAgICBzYXNzVmFyaWFibGVzOiBcIkAvY3NzL3F1YXNhci52YXJpYWJsZXMuc2Nzc1wiXHJcbiAgICB9KSxcclxuXHJcbiAgICBWaXRlUFdBKHB3YU9wdGlvbnMpLFxyXG4gICAgQXV0b0ltcG9ydCh7XHJcbiAgICAgIGluY2x1ZGU6IFsvXFwuW3RqXXN4PyQvLCAvXFwudnVlJC8sIC9cXC52dWVcXD92dWUvLCAvXFwubWQkL10sXHJcbiAgICAgIGltcG9ydHM6IFtcclxuICAgICAgICBcInF1YXNhclwiLFxyXG4gICAgICAgIFwidnVlXCIsXHJcbiAgICAgICAgXCJ2dWUtcm91dGVyXCIsXHJcbiAgICAgICAgXCJ2dWUtaTE4blwiLFxyXG4gICAgICAgIFwiQHZ1ZXVzZS9jb3JlXCIsXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgYXhpb3M6IFtbXCJkZWZhdWx0XCIsIFwiYXhpb3NcIl0sIFwiQXhpb3NFcnJvclwiXVxyXG4gICAgICAgIH1cclxuICAgICAgXSxcclxuICAgICAgZGlyczogW1wic3JjL2NvbXBvc2FibGUvKipcIl0sXHJcbiAgICAgIGR0czogXCJzcmMvYXV0by1pbXBvcnRzLmQudHNcIixcclxuICAgICAgdnVlVGVtcGxhdGU6IHRydWUsXHJcbiAgICAgIHJlc29sdmVyczogW10sXHJcbiAgICAgIGVzbGludHJjOiB7XHJcbiAgICAgICAgZW5hYmxlZDogdHJ1ZSxcclxuICAgICAgICBmaWxlcGF0aDogXCIuLy5lc2xpbnRyYy1hdXRvLWltcG9ydC5qc29uXCIsXHJcbiAgICAgICAgZ2xvYmFsc1Byb3BWYWx1ZTogdHJ1ZVxyXG4gICAgICB9XHJcbiAgICB9KSxcclxuICAgIENvbXBvbmVudHMoe1xyXG4gICAgICAvLyByZWxhdGl2ZSBwYXRocyB0byB0aGUgZGlyZWN0b3J5IHRvIHNlYXJjaCBmb3IgY29tcG9uZW50cy5cclxuICAgICAgZGlyczogW1wic3JjL2NvbXBvbmVudHMvZ2xvYmFsXCJdLFxyXG5cclxuICAgICAgLy8gdmFsaWQgZmlsZSBleHRlbnNpb25zIGZvciBjb21wb25lbnRzLlxyXG4gICAgICBleHRlbnNpb25zOiBbXCJ2dWVcIl0sXHJcblxyXG4gICAgICBkdHM6IFwic3JjL2NvbXBvbmVudHMuZC50c1wiIC8vIGVuYWJsZWQgYnkgZGVmYXVsdCBpZiBgdHlwZXNjcmlwdGAgaXMgaW5zdGFsbGVkXHJcbiAgICB9KSxcclxuICAgIGNyZWF0ZUh0bWxQbHVnaW4oe1xyXG4gICAgICBpbmplY3Q6IHtcclxuICAgICAgICBkYXRhOiB7XHJcbiAgICAgICAgICBpbmplY3RBcHBsZVRvdWNoSWNvbnM6IGBcclxuICAgICAgICAgICAgPGxpbmsgcmVsPVwiYXBwbGUtdG91Y2gtaWNvblwiIGhyZWY9XCIvcmVzb3VyY2VzL3B3YS8ke2ljb25UeXBlfS9pb3MvNjAucG5nPyR7aWNvblZlcnNpb259XCIgc2l6ZXM9XCI2MHg2MFwiIC8+XHJcbiAgICAgICAgICAgIDxsaW5rIHJlbD1cImFwcGxlLXRvdWNoLWljb25cIiBocmVmPVwiL3Jlc291cmNlcy9wd2EvJHtpY29uVHlwZX0vaW9zLzc2LnBuZz8ke2ljb25WZXJzaW9ufVwiIHNpemVzPVwiNzZ4NzZcIiAvPlxyXG4gICAgICAgICAgICA8bGluayByZWw9XCJhcHBsZS10b3VjaC1pY29uXCIgaHJlZj1cIi9yZXNvdXJjZXMvcHdhLyR7aWNvblR5cGV9L2lvcy8xMjAucG5nPyR7aWNvblZlcnNpb259XCIgc2l6ZXM9XCIxMjB4MTIwXCIgLz5cclxuICAgICAgICAgICAgPGxpbmsgcmVsPVwiYXBwbGUtdG91Y2gtaWNvblwiIGhyZWY9XCIvcmVzb3VyY2VzL3B3YS8ke2ljb25UeXBlfS9pb3MvMTUyLnBuZz8ke2ljb25WZXJzaW9ufVwiIHNpemVzPVwiMTUyeDE1MlwiIC8+XHJcbiAgICAgICAgICAgIDxsaW5rIHJlbD1cImFwcGxlLXRvdWNoLWljb25cIiBocmVmPVwiL3Jlc291cmNlcy9wd2EvJHtpY29uVHlwZX0vaW9zLzE4MC5wbmc/JHtpY29uVmVyc2lvbn1cIiBzaXplcz1cIjE4MHgxODBcIiAvPlxyXG4gICAgICAgICAgICA8bGluayByZWw9XCJhcHBsZS10b3VjaC1pY29uXCIgaHJlZj1cIi9yZXNvdXJjZXMvcHdhLyR7aWNvblR5cGV9L2lvcy81MTIucG5nPyR7aWNvblZlcnNpb259XCIgLz5cclxuICAgICAgICBgLFxyXG4gICAgICAgICAgaW5qZWN0VGl0bGU6IGBcclxuICAgICAgICAgICAgPHRpdGxlPiR7bmFtZX08L3RpdGxlPlxyXG4gICAgICAgIGBcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH0pXHJcbiAgXSxcclxuICBjc3M6IHtcclxuICAgIHByZXByb2Nlc3Nvck9wdGlvbnM6IHtcclxuICAgICAgc2Nzczoge1xyXG4gICAgICAgIGFkZGl0aW9uYWxEYXRhOiBgQGltcG9ydCBcInNyYy9jc3MvcXVhc2FyLnZhcmlhYmxlcy5zY3NzXCI7YFxyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfSxcclxuICBkZWZpbmU6IHtcclxuICAgIF9fQVBQX1ZFUlNJT05fXzogSlNPTi5zdHJpbmdpZnkodmVyc2lvbilcclxuICB9LFxyXG4gIC8vIHJlc29sdmU6IHtcclxuICAvLyAgIGFsaWFzOiB7XHJcbiAgLy8gICAgIFwiQFwiOiBmaWxlVVJMVG9QYXRoKG5ldyBVUkwoXCIuL3NyY1wiLCBpbXBvcnQubWV0YS51cmwpKVxyXG4gIC8vICAgfVxyXG4gIC8vIH0sXHJcbiAgcmVzb2x2ZToge1xyXG4gICAgYWxpYXM6IHtcclxuICAgICAgXCJAXCI6IHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsIFwiLi9zcmNcIiksXHJcbiAgICAgIHNyYzogcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgXCIuL3NyY1wiKVxyXG4gICAgfVxyXG4gIH0sXHJcbiAgc2VydmVyOiB7XHJcbiAgICBwb3J0OiA4MDgwXHJcbiAgfVxyXG59KTtcclxuIiwgImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJFOlxcXFxQcm9qZWN0c1xcXFxsYW50YXVcXFxcbGFudGF1MzYwLXdlYmFwcFwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiRTpcXFxcUHJvamVjdHNcXFxcbGFudGF1XFxcXGxhbnRhdTM2MC13ZWJhcHBcXFxcdml0ZS5wd2EudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0U6L1Byb2plY3RzL2xhbnRhdS9sYW50YXUzNjAtd2ViYXBwL3ZpdGUucHdhLnRzXCI7aW1wb3J0IHsgVml0ZVBXQU9wdGlvbnMgfSBmcm9tIFwidml0ZS1wbHVnaW4tcHdhXCI7XHJcblxyXG5leHBvcnQgY29uc3QgaWNvblR5cGUgPSBcImljb25zXCI7XHJcbmV4cG9ydCBjb25zdCBuYW1lID0gXCJMYW50YXUzNjAgTGl0ZVwiO1xyXG5cclxuZXhwb3J0IGNvbnN0IHB3YU9wdGlvbnM6IFBhcnRpYWw8Vml0ZVBXQU9wdGlvbnM+ID0ge1xyXG4gIG1vZGU6IFwicHJvZHVjdGlvblwiLFxyXG4gIGJhc2U6IFwiL1wiLFxyXG4gIHJlZ2lzdGVyVHlwZTogXCJwcm9tcHRcIixcclxuICBpbmplY3RSZWdpc3RlcjogXCJzY3JpcHRcIixcclxuICBpbmNsdWRlQXNzZXRzOiBbXCJmYXZpY29uLnN2Z1wiXSxcclxuICBtYW5pZmVzdDoge1xyXG4gICAgaWQ6IFwiLz9ob21lc2NyZWVuPTFcIixcclxuICAgIG5hbWU6IFwiTGFudGF1MzYwIExpdGVcIixcclxuICAgIHNob3J0X25hbWU6IFwiTGFudGF1MzYwXCIsXHJcbiAgICB0aGVtZV9jb2xvcjogXCIjYTA2ZGVkXCIsXHJcbiAgICBiYWNrZ3JvdW5kX2NvbG9yOiBcIiMwMDY1MkVcIixcclxuICAgIHN0YXJ0X3VybDogXCIvP3NvdXJjZT1wd2Emdj0xLjAuMVwiLCAvLyBJbmNsdWRlIHZlcnNpb24gaW4gc3RhcnRfdXJsXHJcbiAgICBkaXNwbGF5OiBcInN0YW5kYWxvbmVcIixcclxuICAgIGljb25zOiBbXHJcbiAgICAgIHtcclxuICAgICAgICBzcmM6IFwiLi9yZXNvdXJjZXMvcHdhL2ljb25zL2FuZHJvaWQvYW5kcm9pZC1sYXVuY2hlcmljb24tNDgtNDgucG5nP3Y9NlwiLFxyXG4gICAgICAgIHNpemVzOiBcIjQ4eDQ4XCIsXHJcbiAgICAgICAgdHlwZTogXCJpbWFnZS9wbmdcIlxyXG4gICAgICB9LFxyXG4gICAgICB7XHJcbiAgICAgICAgc3JjOiBcIi4vcmVzb3VyY2VzL3B3YS9pY29ucy9hbmRyb2lkL2FuZHJvaWQtbGF1bmNoZXJpY29uLTcyLTcyLnBuZz92PTZcIixcclxuICAgICAgICBzaXplczogXCI3Mng3MlwiLFxyXG4gICAgICAgIHR5cGU6IFwiaW1hZ2UvcG5nXCJcclxuICAgICAgfSxcclxuICAgICAge1xyXG4gICAgICAgIHNyYzogXCIuL3Jlc291cmNlcy9wd2EvaWNvbnMvYW5kcm9pZC9hbmRyb2lkLWxhdW5jaGVyaWNvbi05Ni05Ni5wbmc/dj02XCIsXHJcbiAgICAgICAgc2l6ZXM6IFwiOTZ4OTZcIixcclxuICAgICAgICB0eXBlOiBcImltYWdlL3BuZ1wiXHJcbiAgICAgIH0sXHJcbiAgICAgIHtcclxuICAgICAgICBzcmM6IFwiLi9yZXNvdXJjZXMvcHdhL2ljb25zL2FuZHJvaWQvYW5kcm9pZC1sYXVuY2hlcmljb24tMTQ0LTE0NC5wbmc/dj02XCIsXHJcbiAgICAgICAgc2l6ZXM6IFwiMTQ0eDE0NFwiLFxyXG4gICAgICAgIHR5cGU6IFwiaW1hZ2UvcG5nXCJcclxuICAgICAgfSxcclxuICAgICAge1xyXG4gICAgICAgIHNyYzogXCIuL3Jlc291cmNlcy9wd2EvaWNvbnMvYW5kcm9pZC9hbmRyb2lkLWxhdW5jaGVyaWNvbi0xOTItMTkyLnBuZz92PTZcIixcclxuICAgICAgICBzaXplczogXCIxOTJ4MTkyXCIsXHJcbiAgICAgICAgdHlwZTogXCJpbWFnZS9wbmdcIlxyXG4gICAgICB9LFxyXG4gICAgICB7XHJcbiAgICAgICAgc3JjOiBcIi4vcmVzb3VyY2VzL3B3YS9pY29ucy9hbmRyb2lkL2FuZHJvaWQtbGF1bmNoZXJpY29uLTUxMi01MTIucG5nP3Y9NlwiLFxyXG4gICAgICAgIHNpemVzOiBcIjUxMng1MTJcIixcclxuICAgICAgICB0eXBlOiBcImltYWdlL3BuZ1wiXHJcbiAgICAgIH1cclxuICAgIF1cclxuICB9LFxyXG4gIHdvcmtib3g6IHtcclxuICAgIGNsZWFudXBPdXRkYXRlZENhY2hlczogdHJ1ZSxcclxuICAgIHNraXBXYWl0aW5nOiBmYWxzZSxcclxuICAgIGNsaWVudHNDbGFpbTogdHJ1ZSxcclxuICAgIGdsb2JQYXR0ZXJuczogW1xyXG4gICAgICBcIioqLyoue2pzLGNzcyxodG1sLGljbyxwbmcsc3ZnLGpzb24sd29mZjIsd2VicH1cIixcclxuICAgICAgXCJpbmRleC5odG1sXCIsXHJcbiAgICAgIFwibWFuaWZlc3QuanNvblwiLFxyXG4gICAgICBcInJlc291cmNlcy9wd2EvKlwiXHJcbiAgICBdLFxyXG4gICAgbmF2aWdhdGVGYWxsYmFjazogXCJpbmRleC5odG1sXCIsXHJcbiAgICBuYXZpZ2F0ZUZhbGxiYWNrQWxsb3dsaXN0OiBbL14oPyFcXC9fXykuKi9dLFxyXG4gICAgcnVudGltZUNhY2hpbmc6IFtcclxuICAgICAge1xyXG4gICAgICAgIHVybFBhdHRlcm46ICh7IHVybCB9KSA9PiB1cmwucGF0aG5hbWUuc3RhcnRzV2l0aChcIi9yZXNvdXJjZXMvcHdhL1wiKSxcclxuICAgICAgICBoYW5kbGVyOiBcIlN0YWxlV2hpbGVSZXZhbGlkYXRlXCIsXHJcbiAgICAgICAgb3B0aW9uczoge1xyXG4gICAgICAgICAgY2FjaGVOYW1lOiBcInB3YS1hc3NldHNcIixcclxuICAgICAgICAgIGV4cGlyYXRpb246IHtcclxuICAgICAgICAgICAgbWF4RW50cmllczogMjAsXHJcbiAgICAgICAgICAgIG1heEFnZVNlY29uZHM6IDYwICogNjAgLy8gMSBob3VyXHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgICAgY2FjaGVhYmxlUmVzcG9uc2U6IHtcclxuICAgICAgICAgICAgc3RhdHVzZXM6IFswLCAyMDBdXHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICB9LFxyXG4gICAgICB7XHJcbiAgICAgICAgdXJsUGF0dGVybjogL1xcLig/OmpzfGNzcykkL2ksXHJcbiAgICAgICAgaGFuZGxlcjogXCJTdGFsZVdoaWxlUmV2YWxpZGF0ZVwiLFxyXG4gICAgICAgIG9wdGlvbnM6IHtcclxuICAgICAgICAgIGNhY2hlTmFtZTogXCJzdGF0aWMtcmVzb3VyY2VzXCIsXHJcbiAgICAgICAgICBleHBpcmF0aW9uOiB7XHJcbiAgICAgICAgICAgIG1heEVudHJpZXM6IDEwMCxcclxuICAgICAgICAgICAgbWF4QWdlU2Vjb25kczogNjAgKiA2MCAvLyAxIGhvdXJcclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgICBjYWNoZWFibGVSZXNwb25zZToge1xyXG4gICAgICAgICAgICBzdGF0dXNlczogWzAsIDIwMF1cclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgIH0sXHJcbiAgICAgIHtcclxuICAgICAgICB1cmxQYXR0ZXJuOiAvXFwvbWFuaWZlc3RcXC5qc29uLywgLy8gTWF0Y2hlcyByZXF1ZXN0cyBmb3IgbWFuaWZlc3QuanNvblxyXG4gICAgICAgIGhhbmRsZXI6IFwiTmV0d29ya0ZpcnN0XCIsXHJcbiAgICAgICAgb3B0aW9uczoge1xyXG4gICAgICAgICAgY2FjaGVOYW1lOiBcIm1hbmlmZXN0LWNhY2hlXCIsXHJcbiAgICAgICAgICBuZXR3b3JrVGltZW91dFNlY29uZHM6IDMsXHJcbiAgICAgICAgICBleHBpcmF0aW9uOiB7XHJcbiAgICAgICAgICAgIG1heEVudHJpZXM6IDEsXHJcbiAgICAgICAgICAgIG1heEFnZVNlY29uZHM6IDBcclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgICBjYWNoZWFibGVSZXNwb25zZToge1xyXG4gICAgICAgICAgICBzdGF0dXNlczogWzAsIDIwMF1cclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgICBtYXRjaE9wdGlvbnM6IHtcclxuICAgICAgICAgICAgaWdub3JlU2VhcmNoOiBmYWxzZVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgfSxcclxuICAgICAge1xyXG4gICAgICAgIHVybFBhdHRlcm46IC9eaHR0cHM6XFwvXFwvYXBpKC1kZXYpP1xcLmxhbnRhdTM2MFxcLmNvbVxcLy4qJC8sXHJcbiAgICAgICAgaGFuZGxlcjogXCJOZXR3b3JrRmlyc3RcIixcclxuICAgICAgICBvcHRpb25zOiB7XHJcbiAgICAgICAgICBjYWNoZU5hbWU6IFwiYXBpLWNhY2hlXCIsXHJcbiAgICAgICAgICBuZXR3b3JrVGltZW91dFNlY29uZHM6IDUsXHJcbiAgICAgICAgICBleHBpcmF0aW9uOiB7XHJcbiAgICAgICAgICAgIG1heEVudHJpZXM6IDEwMCxcclxuICAgICAgICAgICAgbWF4QWdlU2Vjb25kczogNjAgLy8gMSBtaW51dGVcclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgICBjYWNoZWFibGVSZXNwb25zZToge1xyXG4gICAgICAgICAgICBzdGF0dXNlczogWzAsIDIwMF1cclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgICBtYXRjaE9wdGlvbnM6IHtcclxuICAgICAgICAgICAgaWdub3JlU2VhcmNoOiB0cnVlXHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICB9LFxyXG4gICAgICB7XHJcbiAgICAgICAgdXJsUGF0dGVybjogL15odHRwczpcXC9cXC8oPzpbYS16XVxcLik/dGlsZVxcLm9wZW5zdHJlZXRtYXBcXC5vcmdcXC9cXGQrXFwvXFxkK1xcL1xcZCtcXC5wbmckLyxcclxuICAgICAgICBoYW5kbGVyOiBcIkNhY2hlRmlyc3RcIixcclxuICAgICAgICBvcHRpb25zOiB7XHJcbiAgICAgICAgICBjYWNoZU5hbWU6IFwibWFwLWNhY2hlXCIsXHJcbiAgICAgICAgICBleHBpcmF0aW9uOiB7XHJcbiAgICAgICAgICAgIG1heEVudHJpZXM6IDEwMDBcclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgICBjYWNoZWFibGVSZXNwb25zZToge1xyXG4gICAgICAgICAgICBzdGF0dXNlczogWzAsIDIwMF1cclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgICBtYXRjaE9wdGlvbnM6IHtcclxuICAgICAgICAgICAgaWdub3JlU2VhcmNoOiB0cnVlXHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICBdXHJcbiAgfSxcclxuICBkZXZPcHRpb25zOiB7XHJcbiAgICBlbmFibGVkOiB0cnVlLFxyXG4gICAgdHlwZTogXCJtb2R1bGVcIixcclxuICAgIG5hdmlnYXRlRmFsbGJhY2s6IFwiaW5kZXguaHRtbFwiLFxyXG4gICAgc3VwcHJlc3NXYXJuaW5nczogdHJ1ZVxyXG4gIH1cclxufTtcclxuIiwgIntcclxuICBcIm5hbWVcIjogXCJsYW50YXUzNjAtd2ViYXBwXCIsXHJcbiAgXCJ2ZXJzaW9uXCI6IFwiMS4wLjc1XCIsXHJcbiAgXCJwcml2YXRlXCI6IHRydWUsXHJcbiAgXCJ0eXBlXCI6IFwibW9kdWxlXCIsXHJcbiAgXCJzY3JpcHRzXCI6IHtcclxuICAgIFwiZGV2XCI6IFwidml0ZVwiLFxyXG4gICAgXCJidWlsZFwiOiBcInZpdGUgYnVpbGRcIixcclxuICAgIFwiYnVpbGQtdHNjXCI6IFwidnVlLXRzYyAtLW5vRW1pdCAmJiB2aXRlIGJ1aWxkXCIsXHJcbiAgICBcInNlcnZlXCI6IFwidml0ZSBwcmV2aWV3XCIsXHJcbiAgICBcImxpbnRcIjogXCJlc2xpbnQgLS1leHQgLmpzLC50cywudnVlIC0taWdub3JlLXBhdGggLmdpdGlnbm9yZSAtLWZpeCBzcmNcIixcclxuICAgIFwiZm9ybWF0XCI6IFwicHJldHRpZXIgLiAtLXdyaXRlXCIsXHJcbiAgICBcInByZXBhcmVcIjogXCJ0cy1wYXRjaCBpbnN0YWxsICYmIHR5cGlhIHBhdGNoXCJcclxuICB9LFxyXG4gIFwiZGVwZW5kZW5jaWVzXCI6IHtcclxuICAgIFwiQHF1YXNhci9leHRyYXNcIjogXCJeMS4xNi4xM1wiLFxyXG4gICAgXCJAdmVlLXZhbGlkYXRlL3J1bGVzXCI6IFwiXjQuMTQuN1wiLFxyXG4gICAgXCJAdmVlLXZhbGlkYXRlL3l1cFwiOiBcIl40LjE0LjdcIixcclxuICAgIFwiQHZ1ZS1sZWFmbGV0L3Z1ZS1sZWFmbGV0XCI6IFwiXjAuMTAuMVwiLFxyXG4gICAgXCJAdnVlLXN0cmlwZS92dWUtc3RyaXBlXCI6IFwiXjQuNS4wXCIsXHJcbiAgICBcIkB2dWV1c2UvY29yZVwiOiBcIl4xMS4yLjBcIixcclxuICAgIFwiQHZ1ZXVzZS9pbnRlZ3JhdGlvbnNcIjogXCIxMS4yLjBcIixcclxuICAgIFwiYXhpb3NcIjogXCJeMS43LjdcIixcclxuICAgIFwiY2hhbmdlLWNhc2VcIjogXCJeNS40LjRcIixcclxuICAgIFwibGVhZmxldFwiOiBcIl4xLjkuNFwiLFxyXG4gICAgXCJwaW5pYVwiOiBcIl4yLjIuNlwiLFxyXG4gICAgXCJwaW5pYS1wbHVnaW4tcGVyc2lzdGVkc3RhdGVcIjogXCJeNC4xLjNcIixcclxuICAgIFwicXVhc2FyXCI6IFwiXjIuMTcuNFwiLFxyXG4gICAgXCJ0eXBpYVwiOiBcIl43LjIuMFwiLFxyXG4gICAgXCJ2ZWUtdmFsaWRhdGVcIjogXCJeNC4xNC43XCIsXHJcbiAgICBcInZ1ZVwiOiBcIl4zLjUuMTNcIixcclxuICAgIFwidnVlLWRyYWdnYWJsZS1wbHVzXCI6IFwiXjAuNi4wXCIsXHJcbiAgICBcInZ1ZS1pMThuXCI6IFwiXjEwLjAuNFwiLFxyXG4gICAgXCJ2dWUtcm91dGVyXCI6IFwiXjQuNC41XCIsXHJcbiAgICBcInZ1ZTMtcS10ZWwtaW5wdXRcIjogXCJeMi4wLjRcIixcclxuICAgIFwieXVwXCI6IFwiXjEuNC4wXCJcclxuICB9LFxyXG4gIFwiZGV2RGVwZW5kZW5jaWVzXCI6IHtcclxuICAgIFwiQGludGxpZnkvdW5wbHVnaW4tdnVlLWkxOG5cIjogXCJeNi4wLjBcIixcclxuICAgIFwiQHF1YXNhci92aXRlLXBsdWdpblwiOiBcIl4xLjguMVwiLFxyXG4gICAgXCJAcnlvcHBpcHBpL3VucGx1Z2luLXR5cGlhXCI6IFwiXjEuMC43XCIsXHJcbiAgICBcIkB0eXBlcy9sZWFmbGV0XCI6IFwiXjEuOS4xNFwiLFxyXG4gICAgXCJAdHlwZXMvbm9kZVwiOiBcIl4yMi45LjBcIixcclxuICAgIFwiQHR5cGVzL3Z1ZS10ZWwtaW5wdXRcIjogXCJeMi4xLjdcIixcclxuICAgIFwiQHR5cGVzY3JpcHQtZXNsaW50L2VzbGludC1wbHVnaW5cIjogXCJeOC4xNS4wXCIsXHJcbiAgICBcIkB0eXBlc2NyaXB0LWVzbGludC9wYXJzZXJcIjogXCJeOC4xNS4wXCIsXHJcbiAgICBcIkB2aXRlanMvcGx1Z2luLXZ1ZVwiOiBcIl41LjIuMFwiLFxyXG4gICAgXCJAdnVlL2VzbGludC1jb25maWctcHJldHRpZXJcIjogXCJeMTAuMS4wXCIsXHJcbiAgICBcIkB2dWUvZXNsaW50LWNvbmZpZy10eXBlc2NyaXB0XCI6IFwiXjE0LjEuM1wiLFxyXG4gICAgXCJlc2xpbnRcIjogXCJeOS4xNS4wXCIsXHJcbiAgICBcImVzbGludC1jb25maWctcHJldHRpZXJcIjogXCJeOS4xLjBcIixcclxuICAgIFwiZXNsaW50LXBsdWdpbi1wcmV0dGllclwiOiBcIl41LjIuMVwiLFxyXG4gICAgXCJlc2xpbnQtcGx1Z2luLXZ1ZVwiOiBcIl45LjMxLjBcIixcclxuICAgIFwicHJldHRpZXJcIjogXCJeMy4zLjNcIixcclxuICAgIFwic2Fzc1wiOiBcIl4xLjgxLjBcIixcclxuICAgIFwidHMtcGF0Y2hcIjogXCJeMy4yLjFcIixcclxuICAgIFwidHlwZXNjcmlwdFwiOiBcIjUuNi4zXCIsXHJcbiAgICBcInVucGx1Z2luLWF1dG8taW1wb3J0XCI6IFwiXjAuMTguNVwiLFxyXG4gICAgXCJ1bnBsdWdpbi1yZW1vdmVcIjogXCJeMS4wLjNcIixcclxuICAgIFwidW5wbHVnaW4tdnVlLWNvbXBvbmVudHNcIjogXCJeMC4yNy40XCIsXHJcbiAgICBcInVucGx1Z2luLXZ1ZS1yb3V0ZXJcIjogXCJeMC4xMC44XCIsXHJcbiAgICBcInZpdGVcIjogXCJeNS40LjExXCIsXHJcbiAgICBcInZpdGUtcGx1Z2luLWVzbGludFwiOiBcIl4xLjguMVwiLFxyXG4gICAgXCJ2aXRlLXBsdWdpbi1odG1sXCI6IFwiXjMuMi4yXCIsXHJcbiAgICBcInZpdGUtcGx1Z2luLXB3YVwiOiBcIl4wLjIxLjBcIixcclxuICAgIFwidnVlLWVzbGludC1wYXJzZXJcIjogXCJeOS40LjNcIixcclxuICAgIFwidnVlLXRzY1wiOiBcIl4yLjEuMTBcIlxyXG4gIH0sXHJcbiAgXCJwYWNrYWdlTWFuYWdlclwiOiBcInlhcm5ANC41LjFcIlxyXG59XHJcbiJdLAogICJtYXBwaW5ncyI6ICI7QUFBcVMsT0FBTyxTQUFTO0FBQ3JULE9BQU8sWUFBWTtBQUNuQixPQUFPLHdCQUF3QjtBQUMvQixPQUFPLFNBQVM7QUFFaEIsT0FBTyxnQkFBZ0I7QUFDdkIsT0FBTyxnQkFBZ0I7QUFDdkIsT0FBTyxtQkFBbUI7QUFFMUIsU0FBUyx3QkFBd0I7QUFDakMsU0FBUyxTQUFTLGVBQWU7QUFDakMsU0FBUyxRQUFRLDBCQUEwQjtBQUMzQyxTQUFTLG9CQUFvQjtBQUM3QixTQUFTLHFCQUFxQjtBQUM5QixTQUFTLGVBQWU7OztBQ1RqQixJQUFNLGFBQXNDO0FBQUEsRUFDakQsTUFBTTtBQUFBLEVBQ04sTUFBTTtBQUFBLEVBQ04sY0FBYztBQUFBLEVBQ2QsZ0JBQWdCO0FBQUEsRUFDaEIsZUFBZSxDQUFDLGFBQWE7QUFBQSxFQUM3QixVQUFVO0FBQUEsSUFDUixJQUFJO0FBQUEsSUFDSixNQUFNO0FBQUEsSUFDTixZQUFZO0FBQUEsSUFDWixh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UUFDQTtBQUFBLFFBQ0E7QUFBQSxRQUNBO0FBQUEsUUFDQTtBQUFBLFVBQ0UsT0FBTyxDQUFDLENBQUMsV0FBVyxPQUFPLEdBQUcsWUFBWTtBQUFBLFFBQzVDO0FBQUEsTUFDRjtBQUFBLE1BQ0EsTUFBTSxDQUFDLG1CQUFtQjtBQUFBLE1BQzFCLEtBQUs7QUFBQSxNQUNMLGFBQWE7QUFBQSxNQUNiLFdBQVcsQ0FBQztBQUFBLE1BQ1osVUFBVTtBQUFBLFFBQ1IsU0FBUztBQUFBLFFBQ1QsVUFBVTtBQUFBLFFBQ1Ysa0JBQWtCO0FBQUEsTUFDcEI7QUFBQSxJQUNGLENBQUM7QUFBQSxJQUNELFdBQVc7QUFBQTtBQUFBLE1BRVQsTUFBTSxDQUFDLHVCQUF1QjtBQUFBO0FBQUEsTUFHOUIsWUFBWSxDQUFDLEtBQUs7QUFBQSxNQUVsQixLQUFLO0FBQUE7QUFBQSxJQUNQLENBQUM7QUFBQSxJQUNELGlCQUFpQjtBQUFBLE1BQ2YsUUFBUTtBQUFBLFFBQ04sTUFBTTtBQUFBLFVBQ0osdUJBQXVCO0FBQUEsZ0VBQytCLFFBQVEsZUFBZSxXQUFXO0FBQUEsZ0VBQ2xDLFFBQVEsZUFBZSxXQUFXO0FBQUEsZ0VBQ2xDLFFBQVEsZ0JBQWdCLFdBQVc7QUFBQSxnRUFDbkMsUUFBUSxnQkFBZ0IsV0FBVztBQUFBLGdFQUNuQyxRQUFRLGdCQUFnQixXQUFXO0FBQUEsZ0VBQ25DLFFBQVEsZ0JBQWdCLFdBQVc7QUFBQTtBQUFBLFVBRXpGLGFBQWE7QUFBQSxxQkFDRixJQUFJO0FBQUE7QUFBQSxRQUVqQjtBQUFBLE1BQ0Y7QUFBQSxJQUNGLENBQUM7QUFBQSxFQUNIO0FBQUEsRUFDQSxLQUFLO0FBQUEsSUFDSCxxQkFBcUI7QUFBQSxNQUNuQixNQUFNO0FBQUEsUUFDSixnQkFBZ0I7QUFBQSxNQUNsQjtBQUFBLElBQ0Y7QUFBQSxFQUNGO0FBQUEsRUFDQSxRQUFRO0FBQUEsSUFDTixpQkFBaUIsS0FBSyxVQUFVLE9BQU87QUFBQSxFQUN6QztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxFQU1BLFNBQVM7QUFBQSxJQUNQLE9BQU87QUFBQSxNQUNMLEtBQUssS0FBSyxRQUFRLFdBQVcsT0FBTztBQUFBLE1BQ3BDLEtBQUssS0FBSyxRQUFRLFdBQVcsT0FBTztBQUFBLElBQ3RDO0FBQUEsRUFDRjtBQUFBLEVBQ0EsUUFBUTtBQUFBLElBQ04sTUFBTTtBQUFBLEVBQ1I7QUFDRixDQUFDOyIsCiAgIm5hbWVzIjogW10KfQo=
