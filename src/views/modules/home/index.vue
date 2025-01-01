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
  import { useUserStore } from "@/stores/user";
  import { UserLogon } from "@/composable/use-member";

  //Components
  import MainPage from "./main-page.vue";

  const entityKey: EntityURLKey = "SITE";

  const { eventBus } = useUtilities();
  const dialogStack = ref<string[]>([]);
  const userStore = useUserStore();
  const userLogon = UserLogon();

  onMounted(() => {
    eventBus("DialogStatus").on((status: any, emitter: string) => {
      if (status) {
        dialogStack.value.push(emitter);
      } else {
        dialogStack.value.pop();
      }
    });
  });

  onBeforeRouteLeave((_to, _from, next) => {
    switch (true) {
      case dialogStack.value.length > 0: {
        const emitter = dialogStack.value[dialogStack.value.length - 1];
        eventBus(emitter).emit();
        dialogStack.value.pop();
        next(false);
        break;
      }
      case _to.name === "favourite" && !userStore.isUserLogon(): {
        userLogon.promptUserLogon();
        next(false);
        break;
      }
      case _to.name === "favourite" && userStore.isUserLogon(): {
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
