import { VitePWAOptions } from "vite-plugin-pwa";

export const iconType = "icons";
export const name = "Lantau360 Lite";

export const pwaOptions: Partial<VitePWAOptions> = {
  mode: "production",
  base: "/",
  registerType: "prompt",
  injectRegister: "script",
  includeAssets: ["favicon.svg", "webmanifest"],
  manifest: {
    name: "Lantau360 Lite",
    short_name: "Lantau360",
    theme_color: "#a06ded",
    background_color: "#00652E",
    id: "/?homescreen=1",
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
      "manifest.webmanifest",
      "webmanifest",
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
        urlPattern: /\/manifest\.webmanifest/, // Matches requests for manifest.webmanifest
        handler: "StaleWhileRevalidate",
        options: {
          cacheName: "manifest-cache",
          expiration: {
            maxEntries: 1,
            maxAgeSeconds: 60
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
        urlPattern: /^https:\/\/api(-dev)?\.lantau360\.com\/.*$/,
        handler: "StaleWhileRevalidate",
        options: {
          cacheName: "api-cache",
          expiration: {
            maxEntries: 300,
            maxAgeSeconds: 60 * 3 // 3 minute
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
        urlPattern: /^https:\/\/api(-dev)?\.lantau360\.com\/[^/]+\/SignIn$/, // Match the signin endpoint
        handler: "StaleWhileRevalidate",
        options: {
          cacheName: "signin-api-cache",
          expiration: {
            maxEntries: 1, // Keep only one signin response in the cache
            maxAgeSeconds: 60 * 5 // Cache for 5 minutes
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
        urlPattern: /^https:\/\/api(-dev)?\.lantau360\.com\/[^/]+\/SignUp$/, // Match the signup endpoint
        handler: "StaleWhileRevalidate",
        options: {
          cacheName: "signup-api-cache",
          expiration: {
            maxEntries: 1, // Keep only one signup response in the cache
            maxAgeSeconds: 60 * 5 // Cache for 5 minutes
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
        handler: "StaleWhileRevalidate",
        options: {
          cacheName: "map-cache",
          expiration: {
            maxEntries: 10
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
