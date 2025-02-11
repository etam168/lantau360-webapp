<template>
  <q-page>
    <app-page-title :title="$t(`${i18nKey}.title`)"></app-page-title>

    <main-content :i18nKey class="q-mt-xs"/>
  </q-page>
</template>

<script setup lang="ts">
  // Constants
  import { EntityURLKey } from "@/constants";
  
  // Custom Components
  import MainContent from "./components/main-content.vue";

  // Stores
  import { useOpenDialogStore } from "@/stores/open-dialog-store";
  import { useUserStore } from "@/stores/user";

  // Composables
  import { storeToRefs } from "pinia";
  import { EventBus } from "quasar";
  import { UserLogon } from "@/composable/use-member";
  import { eventBus } from "@/plugins/quasar/event-bus";


  const i18nKey = "more";


  const userStore = useUserStore();
  const userLogon = UserLogon();

  const openDialogStore = useOpenDialogStore();
  const bus = inject("bus") as EventBus;

  const store = useOpenDialogStore();

  // Use storeToRefs for state properties
  const { homePageStack } = storeToRefs(store);

  // Destructure actions/methods directly
  const { dialogStackReset, getCurrentStackValue } = store;

  onMounted(() => {
    dialogStackReset();
  });

  onBeforeRouteLeave((_to, _from, next) => {
    const currentStackValue = getCurrentStackValue();

    switch (true) {
      case currentStackValue !== undefined:
        eventBus.emit("DialogCloseEvent", currentStackValue);
        next(false);
        break;
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
