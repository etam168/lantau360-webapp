import { VitePWAOptions } from "vite-plugin-pwa";

export const iconType = "icons";
export const name = "Lantau360 Lite";

export const pwaOptions: Partial<VitePWAOptions> = {
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
    start_url: "/?source=pwa&v=1.0.1", // Include version in start_url
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
            maxAgeSeconds: 60 * 60 // 1 hour
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
            maxAgeSeconds: 60 * 60 // 1 hour
          },
          cacheableResponse: {
            statuses: [0, 200]
          }
        }
      },
      {
        urlPattern: /\/manifest\.json/, // Matches requests for manifest.json
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
            maxAgeSeconds: 60 // 1 minute
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
            maxEntries: 1000
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
