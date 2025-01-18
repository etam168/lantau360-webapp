// stores/open-dialog-store.ts
import { defineStore } from "pinia";

export const useOpenDialogStore = defineStore("openDialog", () => {
  const currentQuery = ref(new URLSearchParams(window.location.search));

  function getLatestDialogId() {
    const dialogString = currentQuery.value.get("dialog");
    return dialogString ? dialogString.split(",").at(-1) : null;
  }

  function hasDialogId() {
    return currentQuery.value.has("dialog"); // true means we HAVE a dialog
  }

  function removeDialogFromQuery(dialogId: string) {
    if (dialogId === getLatestDialogId()) {
      const dialogString = currentQuery.value.get("dialog");
      if (!dialogString) return;

      const dialogIds = dialogString.split(",");
      dialogIds.pop();

      if (dialogIds.length === 0) {
        currentQuery.value.delete("dialog");
      } else {
        currentQuery.value.set("dialog", dialogIds.join(","));
      }
    }
  }

  function resetQuery() {
    // Clear the URL query parameters and replace history entry
    window.history.replaceState({}, "", window.location.pathname);

    // Reset the store's currentQuery
    currentQuery.value = new URLSearchParams();
  }

  function updateQuery(dialogId: string) {
    // Work with currentQuery directly since it's our source of truth
    const existingDialog = currentQuery.value.get("dialog");

    // Append new dialogId to existing value, separated by comma
    const newDialogValue = existingDialog ? `${existingDialog},${dialogId}` : dialogId;

    // Set the combined value
    currentQuery.value.set("dialog", newDialogValue);
  }

  function updateWindowHistory() {
    if (hasDialogId()) {
      const latestId = getLatestDialogId();
      window.history.replaceState({}, "", `${window.location.pathname}?dialog=${latestId}`);
    } else {
      resetQuery();
    }
  }

  return {
    currentQuery,
    getLatestDialogId,
    hasDialogId,
    removeDialogFromQuery,
    resetQuery,
    updateQuery,
    updateWindowHistory
  };
});
