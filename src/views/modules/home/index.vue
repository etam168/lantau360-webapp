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
  import router from "@/router";

  const entityKey: EntityURLKey = "SITE";

  const dialogStack = ref<string[]>([]);
  const userStore = useUserStore();
  const userLogon = UserLogon();

  const openDialogStore = useOpenDialogStore();

  onMounted(() => {
    alert("mounted on main page");

    openDialogStore.resetQuery();
  });

  onUnmounted(() => {
    alert("un-mounted on main page");
   
  });

  const bus = inject("bus") as EventBus;

  onBeforeRouteLeave((_to, _from, next) => {
    alert("onBeforeRouteLeave");
    switch (true) {
      case openDialogStore.hasDialogId() : {
        const dialogId = openDialogStore.getLatestDialogId();
        bus.emit("DialogClose", dialogId);
        alert(`DialogClose emitted with dialogId: ${dialogId}`);
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
