// vite.config.mts
import dns from "dns";
import eslint from "file:///D:/ETamProjects/Lantau360/lantau360-webapp/node_modules/vite-plugin-eslint/dist/index.mjs";
import vue from "file:///D:/ETamProjects/Lantau360/lantau360-webapp/node_modules/@vitejs/plugin-vue/dist/index.mjs";
import AutoImport from "file:///D:/ETamProjects/Lantau360/lantau360-webapp/node_modules/unplugin-auto-import/dist/vite.js";
import Components from "file:///D:/ETamProjects/Lantau360/lantau360-webapp/node_modules/unplugin-vue-components/dist/vite.js";
import VueI18nPlugin from "file:///D:/ETamProjects/Lantau360/lantau360-webapp/node_modules/@intlify/unplugin-vue-i18n/lib/vite.mjs";
import { createHtmlPlugin } from "file:///D:/ETamProjects/Lantau360/lantau360-webapp/node_modules/vite-plugin-html/dist/index.mjs";
import { dirname, resolve } from "path";
import { quasar, transformAssetUrls } from "file:///D:/ETamProjects/Lantau360/lantau360-webapp/node_modules/@quasar/vite-plugin/src/index.js";
import { defineConfig } from "file:///D:/ETamProjects/Lantau360/lantau360-webapp/node_modules/vite/dist/node/index.js";
import { fileURLToPath } from "url";
import { VitePWA } from "file:///D:/ETamProjects/Lantau360/lantau360-webapp/node_modules/vite-plugin-pwa/dist/index.js";

// package.json
var version = "1.0.5";

// vite.config.mts
var __vite_injected_original_import_meta_url = "file:///D:/ETamProjects/Lantau360/lantau360-webapp/vite.config.mts";
dns.setDefaultResultOrder("verbatim");
var __dirname = dirname(fileURLToPath(__vite_injected_original_import_meta_url));
var pwaOptions = {
  mode: "development",
  base: "/",
  registerType: "prompt",
  injectRegister: "auto",
  includeAssets: ["favicon.svg"],
  // Included assets
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
        src: `./resources/pwa/android-icon-48x48.png?v=3`,
        sizes: "48x48",
        type: "image/png"
      },
      {
        src: `./resources/pwa/android-icon-72x72.png?v=3`,
        sizes: "72x72",
        type: "image/png"
      },
      {
        src: `./resources/pwa/android-icon-96x96.png?v=3`,
        sizes: "96x96",
        type: "image/png"
      },
      {
        src: `./resources/pwa/android-icon-144x144.png?v=3`,
        sizes: "144x144",
        type: "image/png"
      },
      {
        src: `./resources/pwa/android-icon-192x192.png?v=3`,
        sizes: "192x192",
        type: "image/png"
      },
      {
        src: "./resources/pwa/android-icon-256x256.png?v=3",
        sizes: "256x256",
        type: "image/png"
      },
      {
        src: `./resources/pwa/android-icon-512x512.png?v=3`,
        sizes: "512x512",
        type: "image/png"
      }
    ]
  },
  workbox: {
    globPatterns: ["**/*.{js,css,html,ico,png,svg,json,vue,txt,woff2}"],
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
        urlPattern: /\/api\//,
        handler: "NetworkFirst",
        options: {
          cacheName: "api-cache",
          expiration: {
            maxEntries: 50,
            maxAgeSeconds: 5 * 60
            // 5 Minutes
          }
        }
      },
      {
        urlPattern: /\.(?:png|jpg|jpeg|svg|gif)$/,
        handler: "CacheFirst",
        options: {
          cacheName: "image-cache",
          expiration: {
            maxEntries: 200,
            maxAgeSeconds: 30 * 24 * 60 * 60
            // 30 Days
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
var vite_config_default = defineConfig({
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
      dts: "src/components.d.ts"
      // enabled by default if `typescript` is installed
    }),
    createHtmlPlugin({
      inject: {
        data: {
          injectAppleTouchIcons: `
            <link rel="apple-touch-icon" href="/resources/pwa/apple-touch-icon-60x60.png?v=1" sizes="60x60" />
            <link rel="apple-touch-icon" href="/resources/pwa/apple-touch-icon-76x76.png?v=1" sizes="76x76" />
            <link rel="apple-touch-icon" href="/resources/pwa/apple-touch-icon-120x120.png?v=1" sizes="120x120" />
            <link rel="apple-touch-icon" href="/resources/pwa/apple-touch-icon-152x152.png?v=1" sizes="152x152" />
            <link rel="apple-touch-icon" href="/resources/pwa/apple-touch-icon-180x180.png?v=1" sizes="180x180" />
            <link rel="apple-touch-icon" href="/resources/pwa/apple-touch-icon.png?v=1" />
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
      "@": fileURLToPath(new URL("./src", __vite_injected_original_import_meta_url))
    }
  },
  server: {
    port: 8080
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcubXRzIiwgInBhY2thZ2UuanNvbiJdLAogICJzb3VyY2VzQ29udGVudCI6IFsiY29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2Rpcm5hbWUgPSBcIkQ6XFxcXEVUYW1Qcm9qZWN0c1xcXFxMYW50YXUzNjBcXFxcbGFudGF1MzYwLXdlYmFwcFwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiRDpcXFxcRVRhbVByb2plY3RzXFxcXExhbnRhdTM2MFxcXFxsYW50YXUzNjAtd2ViYXBwXFxcXHZpdGUuY29uZmlnLm10c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vRDovRVRhbVByb2plY3RzL0xhbnRhdTM2MC9sYW50YXUzNjAtd2ViYXBwL3ZpdGUuY29uZmlnLm10c1wiO2ltcG9ydCBkbnMgZnJvbSBcImRuc1wiO1xyXG5pbXBvcnQgZXNsaW50IGZyb20gXCJ2aXRlLXBsdWdpbi1lc2xpbnRcIjtcclxuaW1wb3J0IHZ1ZSBmcm9tIFwiQHZpdGVqcy9wbHVnaW4tdnVlXCI7XHJcbmltcG9ydCBBdXRvSW1wb3J0IGZyb20gXCJ1bnBsdWdpbi1hdXRvLWltcG9ydC92aXRlXCI7XHJcbmltcG9ydCBDb21wb25lbnRzIGZyb20gXCJ1bnBsdWdpbi12dWUtY29tcG9uZW50cy92aXRlXCI7XHJcbmltcG9ydCBWdWVJMThuUGx1Z2luIGZyb20gXCJAaW50bGlmeS91bnBsdWdpbi12dWUtaTE4bi92aXRlXCI7XHJcbmltcG9ydCB7IGNyZWF0ZUh0bWxQbHVnaW4gfSBmcm9tIFwidml0ZS1wbHVnaW4taHRtbFwiO1xyXG5pbXBvcnQgeyBkaXJuYW1lLCByZXNvbHZlIH0gZnJvbSBcInBhdGhcIjtcclxuaW1wb3J0IHsgcXVhc2FyLCB0cmFuc2Zvcm1Bc3NldFVybHMgfSBmcm9tIFwiQHF1YXNhci92aXRlLXBsdWdpblwiO1xyXG5pbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tIFwidml0ZVwiO1xyXG5pbXBvcnQgeyBmaWxlVVJMVG9QYXRoIH0gZnJvbSBcInVybFwiO1xyXG5pbXBvcnQgeyBWaXRlUFdBLCBWaXRlUFdBT3B0aW9ucyB9IGZyb20gXCJ2aXRlLXBsdWdpbi1wd2FcIjtcclxuaW1wb3J0IHsgdmVyc2lvbiB9IGZyb20gXCIuL3BhY2thZ2UuanNvblwiO1xyXG5cclxuZG5zLnNldERlZmF1bHRSZXN1bHRPcmRlcihcInZlcmJhdGltXCIpO1xyXG5jb25zdCBfX2Rpcm5hbWUgPSBkaXJuYW1lKGZpbGVVUkxUb1BhdGgoaW1wb3J0Lm1ldGEudXJsKSk7XHJcbmNvbnN0IHB3YU9wdGlvbnM6IFBhcnRpYWw8Vml0ZVBXQU9wdGlvbnM+ID0ge1xyXG4gIG1vZGU6IFwiZGV2ZWxvcG1lbnRcIixcclxuICBiYXNlOiBcIi9cIixcclxuICByZWdpc3RlclR5cGU6IFwicHJvbXB0XCIsXHJcbiAgaW5qZWN0UmVnaXN0ZXI6IFwiYXV0b1wiLFxyXG4gIGluY2x1ZGVBc3NldHM6IFtcImZhdmljb24uc3ZnXCJdLCAvLyBJbmNsdWRlZCBhc3NldHNcclxuICBtYW5pZmVzdDoge1xyXG4gICAgbmFtZTogXCJMYW50YXUzNjAgTGl0ZVwiLFxyXG4gICAgc2hvcnRfbmFtZTogXCJMYW50YXUzNjBMXCIsXHJcbiAgICB0aGVtZV9jb2xvcjogXCIjZmZmZmZmXCIsXHJcbiAgICBiYWNrZ3JvdW5kX2NvbG9yOiBcIiMwMDY1MkVcIixcclxuICAgIHN0YXJ0X3VybDogXCIvP3NvdXJjZT1wd2FcIixcclxuICAgIGRpc3BsYXk6IFwic3RhbmRhbG9uZVwiLFxyXG4gICAgaWNvbnM6IFtcclxuICAgICAgLy8gQW5kcm9pZCBsYXVuY2hlciBpY29uc1xyXG4gICAgICB7XHJcbiAgICAgICAgc3JjOiBgLi9yZXNvdXJjZXMvcHdhL2FuZHJvaWQtaWNvbi00OHg0OC5wbmc/dj0zYCxcclxuICAgICAgICBzaXplczogXCI0OHg0OFwiLFxyXG4gICAgICAgIHR5cGU6IFwiaW1hZ2UvcG5nXCJcclxuICAgICAgfSxcclxuICAgICAge1xyXG4gICAgICAgIHNyYzogYC4vcmVzb3VyY2VzL3B3YS9hbmRyb2lkLWljb24tNzJ4NzIucG5nP3Y9M2AsXHJcbiAgICAgICAgc2l6ZXM6IFwiNzJ4NzJcIixcclxuICAgICAgICB0eXBlOiBcImltYWdlL3BuZ1wiXHJcbiAgICAgIH0sXHJcbiAgICAgIHtcclxuICAgICAgICBzcmM6IGAuL3Jlc291cmNlcy9wd2EvYW5kcm9pZC1pY29uLTk2eDk2LnBuZz92PTNgLFxyXG4gICAgICAgIHNpemVzOiBcIjk2eDk2XCIsXHJcbiAgICAgICAgdHlwZTogXCJpbWFnZS9wbmdcIlxyXG4gICAgICB9LFxyXG4gICAgICB7XHJcbiAgICAgICAgc3JjOiBgLi9yZXNvdXJjZXMvcHdhL2FuZHJvaWQtaWNvbi0xNDR4MTQ0LnBuZz92PTNgLFxyXG4gICAgICAgIHNpemVzOiBcIjE0NHgxNDRcIixcclxuICAgICAgICB0eXBlOiBcImltYWdlL3BuZ1wiXHJcbiAgICAgIH0sXHJcbiAgICAgIHtcclxuICAgICAgICBzcmM6IGAuL3Jlc291cmNlcy9wd2EvYW5kcm9pZC1pY29uLTE5MngxOTIucG5nP3Y9M2AsXHJcbiAgICAgICAgc2l6ZXM6IFwiMTkyeDE5MlwiLFxyXG4gICAgICAgIHR5cGU6IFwiaW1hZ2UvcG5nXCJcclxuICAgICAgfSxcclxuICAgICAge1xyXG4gICAgICAgIHNyYzogXCIuL3Jlc291cmNlcy9wd2EvYW5kcm9pZC1pY29uLTI1NngyNTYucG5nP3Y9M1wiLFxyXG4gICAgICAgIHNpemVzOiBcIjI1NngyNTZcIixcclxuICAgICAgICB0eXBlOiBcImltYWdlL3BuZ1wiXHJcbiAgICAgIH0sXHJcbiAgICAgIHtcclxuICAgICAgICBzcmM6IGAuL3Jlc291cmNlcy9wd2EvYW5kcm9pZC1pY29uLTUxMng1MTIucG5nP3Y9M2AsXHJcbiAgICAgICAgc2l6ZXM6IFwiNTEyeDUxMlwiLFxyXG4gICAgICAgIHR5cGU6IFwiaW1hZ2UvcG5nXCJcclxuICAgICAgfVxyXG4gICAgXVxyXG4gIH0sXHJcbiAgd29ya2JveDoge1xyXG4gICAgZ2xvYlBhdHRlcm5zOiBbXCIqKi8qLntqcyxjc3MsaHRtbCxpY28scG5nLHN2Zyxqc29uLHZ1ZSx0eHQsd29mZjJ9XCJdLFxyXG4gICAgcnVudGltZUNhY2hpbmc6IFtcclxuICAgICAge1xyXG4gICAgICAgIHVybFBhdHRlcm46ICh7IHVybCB9KSA9PiB1cmwucGF0aG5hbWUuc3RhcnRzV2l0aChcIi9yZXNvdXJjZXMvcHdhL1wiKSxcclxuICAgICAgICBoYW5kbGVyOiBcIkNhY2hlRmlyc3RcIixcclxuICAgICAgICBvcHRpb25zOiB7XHJcbiAgICAgICAgICBjYWNoZU5hbWU6IFwicHdhLWljb25zXCIsXHJcbiAgICAgICAgICBleHBpcmF0aW9uOiB7XHJcbiAgICAgICAgICAgIG1heEVudHJpZXM6IDEwXHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICB9LFxyXG4gICAgICB7XHJcbiAgICAgICAgdXJsUGF0dGVybjogL1xcL2FwaVxcLy8sXHJcbiAgICAgICAgaGFuZGxlcjogXCJOZXR3b3JrRmlyc3RcIixcclxuICAgICAgICBvcHRpb25zOiB7XHJcbiAgICAgICAgICBjYWNoZU5hbWU6IFwiYXBpLWNhY2hlXCIsXHJcbiAgICAgICAgICBleHBpcmF0aW9uOiB7XHJcbiAgICAgICAgICAgIG1heEVudHJpZXM6IDUwLFxyXG4gICAgICAgICAgICBtYXhBZ2VTZWNvbmRzOiA1ICogNjAgLy8gNSBNaW51dGVzXHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICB9LFxyXG4gICAgICB7XHJcbiAgICAgICAgdXJsUGF0dGVybjogL1xcLig/OnBuZ3xqcGd8anBlZ3xzdmd8Z2lmKSQvLFxyXG4gICAgICAgIGhhbmRsZXI6IFwiQ2FjaGVGaXJzdFwiLFxyXG4gICAgICAgIG9wdGlvbnM6IHtcclxuICAgICAgICAgIGNhY2hlTmFtZTogXCJpbWFnZS1jYWNoZVwiLFxyXG4gICAgICAgICAgZXhwaXJhdGlvbjoge1xyXG4gICAgICAgICAgICBtYXhFbnRyaWVzOiAyMDAsXHJcbiAgICAgICAgICAgIG1heEFnZVNlY29uZHM6IDMwICogMjQgKiA2MCAqIDYwIC8vIDMwIERheXNcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIF1cclxuICB9LFxyXG4gIGRldk9wdGlvbnM6IHtcclxuICAgIGVuYWJsZWQ6IHByb2Nlc3MuZW52LlNXX0RFViA9PT0gXCJ0cnVlXCIsXHJcbiAgICB0eXBlOiBcIm1vZHVsZVwiLFxyXG4gICAgbmF2aWdhdGVGYWxsYmFjazogXCJpbmRleC5odG1sXCIsXHJcbiAgICBzdXBwcmVzc1dhcm5pbmdzOiB0cnVlXHJcbiAgfVxyXG59O1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKHtcclxuICBidWlsZDoge1xyXG4gICAgY2h1bmtTaXplV2FybmluZ0xpbWl0OiA2MDBcclxuICB9LFxyXG4gIHBsdWdpbnM6IFtcclxuICAgIHZ1ZSh7XHJcbiAgICAgIHRlbXBsYXRlOiB7IHRyYW5zZm9ybUFzc2V0VXJscyB9XHJcbiAgICB9KSxcclxuICAgIGVzbGludCgpLFxyXG4gICAgVnVlSTE4blBsdWdpbih7XHJcbiAgICAgIGluY2x1ZGU6IHJlc29sdmUoX19kaXJuYW1lLCBcIi4vcGF0aC90by9zcmMvbG9jYWxlcy8qKlwiKSxcclxuICAgICAgcnVudGltZU9ubHk6IGZhbHNlXHJcbiAgICB9KSxcclxuICAgIHF1YXNhcih7XHJcbiAgICAgIHNhc3NWYXJpYWJsZXM6IFwic3JjL2Nzcy9xdWFzYXIudmFyaWFibGVzLnNjc3NcIlxyXG4gICAgfSksXHJcbiAgICBWaXRlUFdBKHB3YU9wdGlvbnMpLFxyXG4gICAgQXV0b0ltcG9ydCh7XHJcbiAgICAgIGluY2x1ZGU6IFsvXFwuW3RqXXN4PyQvLCAvXFwudnVlJC8sIC9cXC52dWVcXD92dWUvLCAvXFwubWQkL10sXHJcbiAgICAgIGltcG9ydHM6IFtcclxuICAgICAgICBcInF1YXNhclwiLFxyXG4gICAgICAgIFwidnVlXCIsXHJcbiAgICAgICAgXCJ2dWUtcm91dGVyXCIsXHJcbiAgICAgICAgXCJ2dWUtaTE4blwiLFxyXG4gICAgICAgIFwiQHZ1ZXVzZS9jb3JlXCIsXHJcbiAgICAgICAgLy8gQXV0by1pbXBvcnQgdnVlLWkxOG4gZnVuY3Rpb25zXHJcbiAgICAgICAgLy8ge1xyXG4gICAgICAgIC8vICAgXCJ2dWUtaTE4blwiOiBbXHJcbiAgICAgICAgLy8gICAgIC8vIGltcG9ydCB7IHVzZUkxOG4gfSBmcm9tIFwidnVlLWkxOG5cIlxyXG4gICAgICAgIC8vICAgICBcInVzZUkxOG5cIiAvLyBpZiB5b3UncmUgdXNpbmcgQ29tcG9zaXRpb24gQVBJXHJcbiAgICAgICAgLy8gICBdXHJcbiAgICAgICAgLy8gfSxcclxuICAgICAgICB7XHJcbiAgICAgICAgICBheGlvczogW1tcImRlZmF1bHRcIiwgXCJheGlvc1wiXSwgXCJBeGlvc0Vycm9yXCJdXHJcbiAgICAgICAgfVxyXG4gICAgICBdLFxyXG4gICAgICBkaXJzOiBbXCJzcmMvY29tcG9zYWJsZS8qKlwiXSxcclxuICAgICAgZHRzOiBcInNyYy9hdXRvLWltcG9ydHMuZC50c1wiLFxyXG4gICAgICB2dWVUZW1wbGF0ZTogdHJ1ZSxcclxuICAgICAgcmVzb2x2ZXJzOiBbXSxcclxuICAgICAgZXNsaW50cmM6IHtcclxuICAgICAgICBlbmFibGVkOiB0cnVlLFxyXG4gICAgICAgIGZpbGVwYXRoOiBcIi4vLmVzbGludHJjLWF1dG8taW1wb3J0Lmpzb25cIixcclxuICAgICAgICBnbG9iYWxzUHJvcFZhbHVlOiB0cnVlXHJcbiAgICAgIH1cclxuICAgIH0pLFxyXG4gICAgQ29tcG9uZW50cyh7XHJcbiAgICAgIC8vIHJlbGF0aXZlIHBhdGhzIHRvIHRoZSBkaXJlY3RvcnkgdG8gc2VhcmNoIGZvciBjb21wb25lbnRzLlxyXG4gICAgICBkaXJzOiBbXCJzcmMvY29tcG9uZW50cy9nbG9iYWxcIl0sXHJcblxyXG4gICAgICAvLyB2YWxpZCBmaWxlIGV4dGVuc2lvbnMgZm9yIGNvbXBvbmVudHMuXHJcbiAgICAgIGV4dGVuc2lvbnM6IFtcInZ1ZVwiXSxcclxuXHJcbiAgICAgIGR0czogXCJzcmMvY29tcG9uZW50cy5kLnRzXCIgLy8gZW5hYmxlZCBieSBkZWZhdWx0IGlmIGB0eXBlc2NyaXB0YCBpcyBpbnN0YWxsZWRcclxuICAgIH0pLFxyXG4gICAgY3JlYXRlSHRtbFBsdWdpbih7XHJcbiAgICAgIGluamVjdDoge1xyXG4gICAgICAgIGRhdGE6IHtcclxuICAgICAgICAgIGluamVjdEFwcGxlVG91Y2hJY29uczogYFxyXG4gICAgICAgICAgICA8bGluayByZWw9XCJhcHBsZS10b3VjaC1pY29uXCIgaHJlZj1cIi9yZXNvdXJjZXMvcHdhL2FwcGxlLXRvdWNoLWljb24tNjB4NjAucG5nP3Y9MVwiIHNpemVzPVwiNjB4NjBcIiAvPlxyXG4gICAgICAgICAgICA8bGluayByZWw9XCJhcHBsZS10b3VjaC1pY29uXCIgaHJlZj1cIi9yZXNvdXJjZXMvcHdhL2FwcGxlLXRvdWNoLWljb24tNzZ4NzYucG5nP3Y9MVwiIHNpemVzPVwiNzZ4NzZcIiAvPlxyXG4gICAgICAgICAgICA8bGluayByZWw9XCJhcHBsZS10b3VjaC1pY29uXCIgaHJlZj1cIi9yZXNvdXJjZXMvcHdhL2FwcGxlLXRvdWNoLWljb24tMTIweDEyMC5wbmc/dj0xXCIgc2l6ZXM9XCIxMjB4MTIwXCIgLz5cclxuICAgICAgICAgICAgPGxpbmsgcmVsPVwiYXBwbGUtdG91Y2gtaWNvblwiIGhyZWY9XCIvcmVzb3VyY2VzL3B3YS9hcHBsZS10b3VjaC1pY29uLTE1MngxNTIucG5nP3Y9MVwiIHNpemVzPVwiMTUyeDE1MlwiIC8+XHJcbiAgICAgICAgICAgIDxsaW5rIHJlbD1cImFwcGxlLXRvdWNoLWljb25cIiBocmVmPVwiL3Jlc291cmNlcy9wd2EvYXBwbGUtdG91Y2gtaWNvbi0xODB4MTgwLnBuZz92PTFcIiBzaXplcz1cIjE4MHgxODBcIiAvPlxyXG4gICAgICAgICAgICA8bGluayByZWw9XCJhcHBsZS10b3VjaC1pY29uXCIgaHJlZj1cIi9yZXNvdXJjZXMvcHdhL2FwcGxlLXRvdWNoLWljb24ucG5nP3Y9MVwiIC8+XHJcbiAgICAgICAgYFxyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfSlcclxuICBdLFxyXG4gIGRlZmluZToge1xyXG4gICAgX19BUFBfVkVSU0lPTl9fOiBKU09OLnN0cmluZ2lmeSh2ZXJzaW9uKVxyXG4gIH0sXHJcbiAgcmVzb2x2ZToge1xyXG4gICAgYWxpYXM6IHtcclxuICAgICAgXCJAXCI6IGZpbGVVUkxUb1BhdGgobmV3IFVSTChcIi4vc3JjXCIsIGltcG9ydC5tZXRhLnVybCkpXHJcbiAgICB9XHJcbiAgfSxcclxuICBzZXJ2ZXI6IHtcclxuICAgIHBvcnQ6IDgwODBcclxuICB9XHJcbn0pO1xyXG4iLCAie1xyXG4gIFwibmFtZVwiOiBcImxhbnRhdTM2MC13ZWJhcHBcIixcclxuICBcInZlcnNpb25cIjogXCIxLjAuNVwiLFxyXG4gIFwicHJpdmF0ZVwiOiB0cnVlLFxyXG4gIFwic2NyaXB0c1wiOiB7XHJcbiAgICBcImRldlwiOiBcInZpdGVcIixcclxuICAgIFwiYnVpbGRcIjogXCJ2aXRlIGJ1aWxkXCIsXHJcbiAgICBcImJ1aWxkLXRzY1wiOiBcInZ1ZS10c2MgLS1ub0VtaXQgJiYgdml0ZSBidWlsZFwiLFxyXG4gICAgXCJzZXJ2ZVwiOiBcInZpdGUgcHJldmlld1wiLFxyXG4gICAgXCJsaW50XCI6IFwiZXNsaW50IC0tZXh0IC5qcywudHMsLnZ1ZSAtLWlnbm9yZS1wYXRoIC5naXRpZ25vcmUgLS1maXggc3JjXCIsXHJcbiAgICBcImZvcm1hdFwiOiBcInByZXR0aWVyIC4gLS13cml0ZVwiLFxyXG4gICAgXCJ0eXBlXCI6IFwibW9kdWxlXCJcclxuICB9LFxyXG4gIFwiZGVwZW5kZW5jaWVzXCI6IHtcclxuICAgIFwiQGZvcnRhd2Vzb21lL2ZvbnRhd2Vzb21lLWZyZWVcIjogXCJeNi41LjJcIixcclxuICAgIFwiQHF1YXNhci9leHRyYXNcIjogXCJeMS4xNi4xMVwiLFxyXG4gICAgXCJAdGlwdGFwL2NvcmVcIjogXCJeMi40LjBcIixcclxuICAgIFwiQHRpcHRhcC9leHRlbnNpb24tY2hhcmFjdGVyLWNvdW50XCI6IFwiXjIuNC4wXCIsXHJcbiAgICBcIkB0aXB0YXAvZXh0ZW5zaW9uLWltYWdlXCI6IFwiMi40LjBcIixcclxuICAgIFwiQHRpcHRhcC9leHRlbnNpb24tbGlua1wiOiBcIl4yLjQuMFwiLFxyXG4gICAgXCJAdGlwdGFwL2V4dGVuc2lvbi1zdWJzY3JpcHRcIjogXCJeMi40LjBcIixcclxuICAgIFwiQHRpcHRhcC9leHRlbnNpb24tc3VwZXJzY3JpcHRcIjogXCJeMi40LjBcIixcclxuICAgIFwiQHRpcHRhcC9leHRlbnNpb24tdGV4dC1hbGlnblwiOiBcIl4yLjQuMFwiLFxyXG4gICAgXCJAdGlwdGFwL2V4dGVuc2lvbi11bmRlcmxpbmVcIjogXCJeMi40LjBcIixcclxuICAgIFwiQHRpcHRhcC9wbVwiOiBcIl4yLjQuMFwiLFxyXG4gICAgXCJAdGlwdGFwL3N0YXJ0ZXIta2l0XCI6IFwiXjIuNC4wXCIsXHJcbiAgICBcIkB0aXB0YXAvdnVlLTNcIjogXCJeMi40LjBcIixcclxuICAgIFwiQHR5cGVzL2xvZGFzaC1lc1wiOiBcIl40LjE3LjEyXCIsXHJcbiAgICBcIkB2ZWUtdmFsaWRhdGUvcnVsZXNcIjogXCJeNC4xMi44XCIsXHJcbiAgICBcIkB2ZWUtdmFsaWRhdGUveXVwXCI6IFwiXjQuMTIuOFwiLFxyXG4gICAgXCJAdnVlLWxlYWZsZXQvdnVlLWxlYWZsZXRcIjogXCJeMC4xMC4xXCIsXHJcbiAgICBcIkB2dWUtc3RyaXBlL3Z1ZS1zdHJpcGVcIjogXCJeNC41LjBcIixcclxuICAgIFwiQHZ1ZXVzZS9jb3JlXCI6IFwiXjEwLjkuMFwiLFxyXG4gICAgXCJheGlvc1wiOiBcIl4xLjcuMlwiLFxyXG4gICAgXCJmb250LWF3ZXNvbWVcIjogXCJeNC43LjBcIixcclxuICAgIFwiZ2VvbGliXCI6IFwiXjMuMy40XCIsXHJcbiAgICBcImxlYWZsZXRcIjogXCJeMS45LjRcIixcclxuICAgIFwibG9kYXNoLWVzXCI6IFwiXjQuMTcuMjFcIixcclxuICAgIFwicGluaWFcIjogXCJeMi4xLjdcIixcclxuICAgIFwicGluaWEtcGx1Z2luLXBlcnNpc3RlZHN0YXRlXCI6IFwiXjMuMi4xXCIsXHJcbiAgICBcInF1YXNhclwiOiBcIl4yLjE2LjRcIixcclxuICAgIFwidmVlLXZhbGlkYXRlXCI6IFwiXjQuMTIuOFwiLFxyXG4gICAgXCJ2dWVcIjogXCJeMy40LjI3XCIsXHJcbiAgICBcInZ1ZS1kcmFnZ2FibGUtbmV4dFwiOiBcIl4yLjIuMVwiLFxyXG4gICAgXCJ2dWUtaTE4blwiOiBcIl45LjEzLjFcIixcclxuICAgIFwidnVlLXJvdXRlclwiOiBcIl40LjMuMlwiLFxyXG4gICAgXCJ2dWUzLXEtdGVsLWlucHV0XCI6IFwiXjEuMS43XCIsXHJcbiAgICBcInl1cFwiOiBcIl4xLjQuMFwiXHJcbiAgfSxcclxuICBcImRldkRlcGVuZGVuY2llc1wiOiB7XHJcbiAgICBcIkBpbnRsaWZ5L3VucGx1Z2luLXZ1ZS1pMThuXCI6IFwiXjQuMC4wXCIsXHJcbiAgICBcIkBxdWFzYXIvdml0ZS1wbHVnaW5cIjogXCJeMS43LjBcIixcclxuICAgIFwiQHR5cGVzL2xlYWZsZXRcIjogXCJeMS45LjEyXCIsXHJcbiAgICBcIkB0eXBlcy9ub2RlXCI6IFwiXjIwLjEyLjEyXCIsXHJcbiAgICBcIkB0eXBlcy92dWUtdGVsLWlucHV0XCI6IFwiXjIuMS42XCIsXHJcbiAgICBcIkB0eXBlc2NyaXB0LWVzbGludC9lc2xpbnQtcGx1Z2luXCI6IFwiXjcuMTAuMFwiLFxyXG4gICAgXCJAdHlwZXNjcmlwdC1lc2xpbnQvcGFyc2VyXCI6IFwiXjcuMTAuMFwiLFxyXG4gICAgXCJAdml0ZWpzL3BsdWdpbi12dWVcIjogXCJeNS4wLjRcIixcclxuICAgIFwiQHZ1ZS9lc2xpbnQtY29uZmlnLXByZXR0aWVyXCI6IFwiXjkuMC4wXCIsXHJcbiAgICBcIkB2dWUvZXNsaW50LWNvbmZpZy10eXBlc2NyaXB0XCI6IFwiXjEzLjAuMFwiLFxyXG4gICAgXCJlc2xpbnRcIjogXCJeOC41Ny4wXCIsXHJcbiAgICBcImVzbGludC1jb25maWctcHJldHRpZXJcIjogXCJeOS4xLjBcIixcclxuICAgIFwiZXNsaW50LXBsdWdpbi1wcmV0dGllclwiOiBcIl41LjEuM1wiLFxyXG4gICAgXCJlc2xpbnQtcGx1Z2luLXZ1ZVwiOiBcIl45LjI2LjBcIixcclxuICAgIFwicHJldHRpZXJcIjogXCJeMy4yLjVcIixcclxuICAgIFwic2Fzc1wiOiBcIl4xLjc3LjJcIixcclxuICAgIFwidHlwZXNjcmlwdFwiOiBcIl41LjQuNVwiLFxyXG4gICAgXCJ1bnBsdWdpbi1hdXRvLWltcG9ydFwiOiBcIl4wLjE3LjZcIixcclxuICAgIFwidW5wbHVnaW4tdnVlLWNvbXBvbmVudHNcIjogXCJeMC4yNy4wXCIsXHJcbiAgICBcInVucGx1Z2luLXZ1ZS1yb3V0ZXJcIjogXCJeMC44LjhcIixcclxuICAgIFwidml0ZVwiOiBcIl41LjIuMTFcIixcclxuICAgIFwidml0ZS1wbHVnaW4tZXNsaW50XCI6IFwiXjEuOC4xXCIsXHJcbiAgICBcInZpdGUtcGx1Z2luLWh0bWxcIjogXCJeMy4yLjJcIixcclxuICAgIFwidml0ZS1wbHVnaW4tcHdhXCI6IFwiXjAuMjAuMFwiLFxyXG4gICAgXCJ2dWUtZXNsaW50LXBhcnNlclwiOiBcIl45LjQuMlwiLFxyXG4gICAgXCJ2dWUtdHNjXCI6IFwiXjIuMC4xOVwiXHJcbiAgfSxcclxuICBcInJlc29sdXRpb25zXCI6IHtcclxuICAgIFwidnVlXCI6IFwiXjMuNC4xNVwiXHJcbiAgfVxyXG59XHJcbiJdLAogICJtYXBwaW5ncyI6ICI7QUFBMFQsT0FBTyxTQUFTO0FBQzFVLE9BQU8sWUFBWTtBQUNuQixPQUFPLFNBQVM7QUFDaEIsT0FBTyxnQkFBZ0I7QUFDdkIsT0FBTyxnQkFBZ0I7QUFDdkIsT0FBTyxt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
