import { VitePWAOptions } from "vite-plugin-pwa";

export const iconType = "icons";
export const name = "Lantau360 Lite";
export const iconVersion = "v=6";

export const pwaOptions: Partial<VitePWAOptions> = {
  mode: "production",
  base: "/",
  registerType: "prompt",
  injectRegister: "script",
  includeAssets: ["favicon.svg", "webmanifest"],
  manifest: {
    name: "Lantau360 Lite",
    short_name: "Lantau360",
    theme_color: "#00652E",
    //    background_color: "#00652E",
    background_color: "#00652E",
    id: "/?homescreen=1",
    start_url: "/?source=pwa",
    display: "standalone",
    icons: [
      {
        src: `./resources/pwa/icons/android/android-launchericon-48-48.png?${iconVersion}`,
        sizes: "48x48",
        type: "image/png"
      },
      {
        src: `./resources/pwa/icons/android/android-launchericon-72-72.png?${iconVersion}`,
        sizes: "72x72",
        type: "image/png"
      },
      {
        src: `./resources/pwa/icons/android/android-launchericon-96-96.png?${iconVersion}`,
        sizes: "96x96",
        type: "image/png"
      },
      {
        src: `./resources/pwa/icons/android/android-launchericon-144-144.png?${iconVersion}`,
        sizes: "144x144",
        type: "image/png"
      },
      {
        src: `./resources/pwa/icons/android/android-launchericon-192-192.png?${iconVersion}`,
        sizes: "192x192",
        type: "image/png"
      },
      {
        src: `./resources/pwa/icons/android/android-launchericon-512-512.png?${iconVersion}`,
        sizes: "512x512",
        type: "image/png"
      }
    ]
  },
  workbox: {
    cleanupOutdatedCaches: true,
    skipWaiting: true,
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
        // PWA Core Assets (icons, splash screens)
        urlPattern: ({ url }) => url.pathname.startsWith("/resources/pwa/"),
        handler: "CacheFirst",
        options: {
          cacheName: "pwa-assets",
          expiration: {
            maxEntries: 20,
            maxAgeSeconds: 30 * 24 * 60 * 60 // 30 days for core assets
          },
          cacheableResponse: {
            statuses: [0, 200]
          }
        }
      },
      {
        // JS and CSS files
        urlPattern: /\.(?:js|css)$/i,
        handler: "StaleWhileRevalidate",
        options: {
          cacheName: "static-resources",
          expiration: {
            maxEntries: 100,
            maxAgeSeconds: 7 * 24 * 60 * 60 // 7 days
          },
          cacheableResponse: {
            statuses: [0, 200]
          }
        }
      },
      {
        urlPattern: /\/manifest\.webmanifest/,
        handler: "StaleWhileRevalidate",
        options: {
          cacheName: "manifest-cache",
          expiration: {
            maxEntries: 1,
            maxAgeSeconds: 60 * 60 // 1 hour
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
        // Single API cache with optimized settings
        urlPattern: /^https:\/\/api(-dev)?\.lantau360\.com\/.*$/,
        handler: "StaleWhileRevalidate",
        options: {
          cacheName: "api-cache",
          expiration: {
            maxEntries: 500, // Increased from 300 for better coverage
            maxAgeSeconds: 60 * 30 // 30 minutes - balanced for mixed content types
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
        // Auth endpoints - no caching
        urlPattern: /^https:\/\/api(-dev)?\.lantau360\.com\/[^/]+\/Sign(In|Up)$/,
        handler: "NetworkOnly",
        options: {
          cacheName: "auth-cache",
          expiration: {
            maxEntries: 1,
            maxAgeSeconds: 60 * 5
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
        // Map tiles with increased cache
        urlPattern: /^https:\/\/(?:[a-z]\.)?tile\.openstreetmap\.org\/\d+\/\d+\/\d+\.png$/,
        handler: "CacheFirst",
        options: {
          cacheName: "map-cache",
          expiration: {
            maxEntries: 200, // Increased for better offline map coverage
            maxAgeSeconds: 30 * 24 * 60 * 60 // 30 days
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
