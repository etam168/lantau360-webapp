<template>
  <suspense>
    <!-- "default" slot belongs to Suspense -->
    <template #default>
      <main-page :entityKey />
    </template>

    <!-- "fallback" slot belongs to Suspense -->
    <template #fallback>
      <main-page-skeleton :entityKey />
    </template>
  </suspense>
</template>

<script setup lang="ts">
  // Constants
  import { EntityURLKey } from "@/constants";

  // Stores
  import { useOpenDialogStore } from "@/stores/open-dialog-store";

  // Composables
  import { EventBus } from "quasar";

  //Components
  import MainPage from "./main-page.vue";

  const entityKey: EntityURLKey = "FAVOURITE";

  const openDialogStore = useOpenDialogStore();
  const bus = inject("bus") as EventBus;

  onMounted(() => {
    openDialogStore.resetQuery();
    window.dispatchEvent(new Event("popstate")); // This causes route update
  });

  onBeforeRouteLeave((_to, _from, next) => {
    switch (true) {
      case openDialogStore.hasDialogId(): {
        const dialogId = openDialogStore.getLatestDialogId();
        bus.emit("DialogClose", dialogId);
        next(false); // Prevent navigation if dialogId exists
        break;
      }
      default: {
        next();
        break;
      }
    }
  });
</script>
