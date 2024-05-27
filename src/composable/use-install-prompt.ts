const deferredPrompt = ref();
const isAppInstalled = ref(false);
const userAgent = window.navigator.userAgent;

export const platform = {
  isIos: () => /iphone|ipad|ipod/i.test(userAgent.toLowerCase()),
  isSamsung: () => /Samsung/i.test(userAgent.toLowerCase()),
  isFireFox: () => /Firefox/i.test(userAgent),
  isOpera: () => /opr/i.test(userAgent.toLowerCase()),
  isEdge: () => /edg/i.test(userAgent.toLowerCase())
};

export function useInstallPrompt() {
  const setDeferredPrompt = (event: any) => {
    deferredPrompt.value = event;
    isAppInstalled.value = false;
  };

  const clearDeferredPrompt = () => {
    deferredPrompt.value = null;
  };

  const promptInstall = () => {
    if (deferredPrompt.value) {
      deferredPrompt.value.prompt();
      deferredPrompt.value.userChoice.then((choiceResult: any) => {
        if (choiceResult.outcome === "accepted") {
          console.log("User accepted the install prompt");
        } else {
          console.log("User dismissed the install prompt");
        }
        deferredPrompt.value = null;
      });
    }
  };

  const checkIfAppInstalled = () => {
    // Check if app is installed on iOS
    if ("standalone" in window.navigator && (window.navigator as any).standalone) {
      isAppInstalled.value = true;
    }
    // Check if app is installed in other environments
    if (window.matchMedia("(display-mode: standalone)").matches) {
      isAppInstalled.value = true;
    }
  };

  //const navigateToInstalledApp = () => {
  // Attempt to open the app using its URL scheme
  // Replace 'myappscheme://' with the actual scheme of your app
  //   window.location.href = "lantau360-webapp://";
  // };

  window.addEventListener("appinstalled", () => {
    isAppInstalled.value = true;
    console.log("App installed successfully");
  });

  onMounted(() => {
    checkIfAppInstalled();
    window.addEventListener("beforeinstallprompt", (event: any) => {
      event.preventDefault();
      setDeferredPrompt(event);
    });
  });

  return {
    checkIfAppInstalled,
    deferredPrompt,
    setDeferredPrompt,
    clearDeferredPrompt,
    isAppInstalled,
    platform,
    promptInstall
  };
}
