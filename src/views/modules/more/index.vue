<template>
  <q-page>
    <app-page-title :title="$t(`${i18nKey}.title`)"></app-page-title>

    <main-content :i18nKey class="q-mt-xs"/>
  </q-page>
</template>

<script setup lang="ts">
  // Custom Components
  import MainContent from "./components/main-content.vue";

  // Stores
  import { useOpenDialogStore } from "@/stores/open-dialog-store";
  import { useUserStore } from "@/stores/user";
  import { EventBus } from "quasar";

  const bus = inject("bus") as EventBus;

  const i18nKey = "more";

  const openDialogStore = useOpenDialogStore();
  const userLogon = UserLogon();
  const userStore = useUserStore();

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
