const deferredPrompt = ref();
const isAppInstalled = ref(false);

export function useInstallPrompt() {
  const setDeferredPrompt = (event: any) => {
    deferredPrompt.value = event;
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
  return {
    deferredPrompt,
    setDeferredPrompt,
    clearDeferredPrompt,
    isAppInstalled,
    promptInstall
  };
}
