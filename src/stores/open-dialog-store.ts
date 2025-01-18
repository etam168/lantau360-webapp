// stores/open-dialog-store.ts
import { defineStore } from "pinia";

export const useOpenDialogStore = defineStore("openDialog", () => {
  const currentUrl = ref(window.location.href);
  const currentQuery = ref(new URLSearchParams(window.location.search));

  function updateUrl(newUrl: string) {
    currentUrl.value = newUrl;
    currentQuery.value = new URLSearchParams(new URL(newUrl).search);
  }

  function resetQuery() {
    const url = new URL(window.location.href);
    url.search = "";
    currentUrl.value = url.toString();
    currentQuery.value = new URLSearchParams();
  }

  return {
    currentUrl,
    currentQuery,
    updateUrl,
    resetQuery
  };
});
