import { Plugin } from "vue";
import { Router } from "vue-router";

const InternetConnectionPlugin: Plugin = {
  install(app, router: Router) {
    let isOnline = navigator.onLine;

    if (!isOnline) {
      router.push({ name: "offlinePage" });
    }
    const updateOnlineStatus = () => {
      isOnline = navigator.onLine;
      if (!isOnline) {
        router.push({ name: "offlinePage" });
      } else {
        router.push("/");
      }
    };

    const handleOnlineStatusChange = () => {
      window.addEventListener("online", updateOnlineStatus);
      window.addEventListener("offline", updateOnlineStatus);
    };

    handleOnlineStatusChange();

    app.mixin({
      beforeMount() {
        handleOnlineStatusChange();
      },
      beforeUnmount() {
        window.removeEventListener("online", updateOnlineStatus);
        window.removeEventListener("offline", updateOnlineStatus);
      }
    });
  }
};

export default InternetConnectionPlugin;
