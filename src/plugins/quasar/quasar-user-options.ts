import "@quasar/extras/roboto-font/roboto-font.css";

import iconSet from "quasar/icon-set/fontawesome-v6";
import {
  Dialog,
  Loading,
  Notify,
  LocalStorage,
  SessionStorage,
  BottomSheet,
  AddressbarColor
} from "quasar";

// To be used on app.use(Quasar, { ... })
export default {
  iconSet: iconSet,
  plugins: {
    AddressbarColor,
    Dialog,
    Loading,
    Notify,
    LocalStorage,
    SessionStorage,
    BottomSheet
  }
};
