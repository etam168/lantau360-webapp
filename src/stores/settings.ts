import { settings as defaultSettings } from "@/config";
import { defineStore } from "pinia";

const getDefaultSettings = () => {
  return JSON.parse(JSON.stringify(defaultSettings));
};
export const useSettingsStore = defineStore("settings", {
  state: () => getDefaultSettings(),

  actions: {
    SetLocale(payload) {
      this.locale = payload.locale;
      // await setLocale(payload.locale);
    },
    ThemeToggle(payload) {
      this.theme.index = payload.index;
    },
    ThemeDarkToggle() {
      this.theme.dark = !this.theme.dark;
    },
    ToolbarDenseToggle() {
      this.dense = !this.dense;
    },
    NavbarDenseToggle() {
      this.navbar.dense = !this.navbar.dense;
    },
    NavbarLogoToggle() {
      this.navbar.logo = !this.navbar.logo;
    },
    NavbarToggle() {
      this.navbar.show = !this.navbar.show;
    },
    NavbarState(payload) {
      this.navbar.show = payload.state;
    },
    FullscreenToggle(payload) {
      this.fullscreen.show = payload.state;
    },
    FullscreenBtn(payload) {
      this.fullscreen.btn = payload.state;
    },
    SettingsPanelBtnToggle() {
      this.settingsPanel.btn = !this.settingsPanel.btn;
    },
    SettingsPanelToggle() {
      this.settingsPanel.show = !this.settingsPanel.show;
    },
    SettingsPanelState(payload) {
      this.settingsPanel.show = payload.state;
    },
    SettingsPanelDefault() {
      this.SetSettings(getDefaultSettings());
    },
    FooterToggle() {
      this.footer = !this.footer;
    },
    SetSettings(payload) {
      this.locale = payload.locale || this.locale;
      this.dense = typeof payload.dense === "boolean" ? payload.dense : this.dense;
      this.footer = typeof payload.dense === "boolean" ? payload.footer : this.footer;
      this.navbar = payload.navbar || this.navbar;
      this.fullscreen = payload.fullscreen || this.fullscreen;
      this.settingsPanel = payload.settingsPanel || this.settingsPanel;
      this.theme = payload.theme || this.theme;
    }
  },
  persist: true
});
