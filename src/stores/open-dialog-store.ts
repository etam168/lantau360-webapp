// stores/open-dialog-store.ts
import { defineStore } from "pinia";

export const useOpenDialogStore = defineStore("openDialog", () => {
  const currentUrl = ref(window.location.href);
  const currentQuery = ref(new URLSearchParams(window.location.search));

  function updateUrl(newUrl: string) {
    currentUrl.value = newUrl;
    currentQuery.value = new URLSearchParams(new URL(newUrl).search);
  }

  function updateQuery(dialogId: string) {
    const currentQuery = new URLSearchParams(window.location.search);

    // Get existing dialog value (if any)
    const existingDialog = currentQuery.get("dialog");

    // Append new dialogId to existing value, separated by comma
    const newDialogValue = existingDialog ? `${existingDialog},${dialogId}` : dialogId;

    // Set the combined value
    currentQuery.set("dialog", newDialogValue);
  }

  function getLatestDialogId() {
    const currentQuery = new URLSearchParams(window.location.search);
    const dialogString = currentQuery.get("dialog");

    if (!dialogString) return null;

    const [...dialogIds] = dialogString.split(",");
    return dialogIds.at(-1);
  }

  function hasDialogId() {
    // Check if the current query has a "dialog" parameter
    return currentQuery.value.has("dialog");
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
    getLatestDialogId,
    hasDialogId,
    updateUrl,
    updateQuery,
    resetQuery
  };
});
