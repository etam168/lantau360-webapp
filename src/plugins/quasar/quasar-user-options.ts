import "@quasar/extras/roboto-font/roboto-font.css";
// import "@quasar/extras/material-icons/material-icons.css";
import "@quasar/extras/fontawesome-v6/fontawesome-v6.css";
import iconSet from "quasar/icon-set/fontawesome-v6";
import { Dialog, Loading, Notify, LocalStorage, SessionStorage, BottomSheet } from "quasar";

// To be used on app.use(Quasar, { ... })
export default {
  iconSet: iconSet,
  plugins: {
    Dialog,
    Loading,
    Notify,
    LocalStorage,
    SessionStorage,
    BottomSheet
  }
};
