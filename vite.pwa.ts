// vite.pwa.ts
import { VitePWAOptions } from "vite-plugin-pwa";

export const iconType = "icons";
export const name = "Lantau360 Lite";

export const pwaOptions: Partial<VitePWAOptions> = {
  mode: "production",
  base: "/",
  registerType: "prompt",
  injectRegister: "script",
  includeAssets: ["favicon.svg"],
  manifest: false,
  workbox: {
    cleanupOutdatedCaches: true,
    skipWaiting: false,
    clientsClaim: true,
    globPatterns: [
      "**/*.{js,css,html,ico,png,svg,json,woff2,webp}",
      "index.html",
      "manifest.webmanifest",
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
            maxAgeSeconds: 60 * 60 // 👈 CHANGE: Increase to 1 hour
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
            maxAgeSeconds: 60 * 60 // 👈 CHANGE: Increase to 1 hour
          },
          cacheableResponse: {
            statuses: [0, 200]
          }
        }
      },
      {
        urlPattern: /\/manifest\.webmanifest/,
        handler: "NetworkFirst",
        options: {
          cacheName: "manifest-cache",
          networkTimeoutSeconds: 10,
          expiration: {
            maxEntries: 1,
            maxAgeSeconds: 60 // 1 minute
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
            maxAgeSeconds: 60 // 1 minute
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
