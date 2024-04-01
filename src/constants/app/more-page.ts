import ICONS from "./image-icon";

export const MENU = {
  CHECKIN: "checkIn",
  LANGUAGE: "language",
  PRIVACY: "privacy",
  TERMS: "terms",
  PROFILE: "profileSetting",
  ACCOUNT: "account"
};

const COMMON_MENU_ITEMS = [
  { name: MENU.LANGUAGE, icon: ICONS.SETTING, title: "more.language" },
  { name: MENU.TERMS, icon: ICONS.TNC, title: "more.terms", contentKey: "Terms" },
  { name: MENU.PRIVACY, icon: ICONS.PRIVACY, title: "more.privacy", contentKey: "Privacy" }
];

export const LOGGED_ON_USER_MENU = [
  ...COMMON_MENU_ITEMS,
  { name: MENU.PROFILE, icon: ICONS.PROFILE, title: "more.profile" },
  { name: MENU.ACCOUNT, icon: ICONS.ACCOUNT, title: "more.account.title" },
  { name: MENU.CHECKIN, icon: ICONS.ACCOUNT, title: "more.checkIn" }
];

export const DEFAULT_MENU = [...COMMON_MENU_ITEMS];
