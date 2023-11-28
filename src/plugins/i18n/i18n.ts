import { createI18n } from "vue-i18n";

import en from "@/locales/en_US";
import hk from "@/locales/zh_HK";
import cn from "@/locales/zh_CN";

const i18n = createI18n({
  locale: localStorage.getItem("locale") || "en",
  fallbackLocale: "en",
  messages: {
    en,
    hk,
    cn
  }
});

export default i18n;
