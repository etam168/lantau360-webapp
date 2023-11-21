import action from "./modules/action";
import auth from "./modules/auth";
import business from "./modules/business";
import contact from "./modules/contact";
import dialog from "./modules/dialog";
import document from "./modules/document";
import dashboard from "./modules/dashboard";
import errors from "./modules/errors";
import layout from "./modules/layout";
import member from "./modules/member";
import privacyPolicy from "./modules/privacy-policy";
import posting from "./modules/posting";
import route from "./modules/route";
import site from "./modules/site";
import settings from "./modules/settings";
import staff from "./modules/staff";
import termsAndConditions from "./modules/terms-and-conditions";
import video from "./modules/video";
import directory from "./modules/directory";
import weather from "./modules/weather";
import content from "./modules/content";

export default {
  action,
  auth,
  business,
  contact,
  settings,

  staff,
  member,

  dialog,
  dashboard,

  route,
  site,
  errors,
  layout,

  posting,
  privacyPolicy,
  termsAndConditions,

  video,
  document,
  directory,
  weather,
  content,

  language: {
    name: "EN"
  }
};
