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
  import { useUserStore } from "@/stores/user";

  // Composables
  import { EventBus } from "quasar";
  import { UserLogon } from "@/composable/use-member";

  //Components
  import MainPage from "./main-page.vue";

  const entityKey: EntityURLKey = "BUSINESS";

  const userStore = useUserStore();
  const userLogon = UserLogon();

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
      case _to.name === "favourite" && !userStore.isUserLogon(): {
        userLogon.localDataNotification();
        next();
        break;
      }
      default: {
        next();
        break;
      }
    }
  });
</script>
