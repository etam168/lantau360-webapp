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
    router.replace({ query: {} });
    // eventBus("DialogStatus").on((status: any, emitter: string) => {
    //   if (status) {
    //     dialogStack.value.push(emitter);
    //   } else {
    //     dialogStack.value.pop();
    //   }
    // });
  });

  onUnmounted(() => {
    alert("un-mounted on main page");
    // eventBus("DialogStatus").on((status: any, emitter: string) => {
    //   if (status) {
    //     dialogStack.value.push(emitter);
    //   } else {
    //     dialogStack.value.pop();
    //   }
    // });
  });

  const bus = inject("bus") as EventBus;

  onBeforeRouteLeave((_to, _from, next) => {
    alert("onBeforeRouteLeave");
    alert("from: " + JSON.stringify(_from));

    const newPath = window.location.href;
    alert(newPath);

    // window.dispatchEvent(new Event("popstate"));
    bus.emit("DialogClose", "Testing 123");

    switch (true) {
      // case dialogStack.value.length > 0: {
      //   //const emitter = dialogStack.value[dialogStack.value.length - 1];
      //   //eventBus(emitter).emit();
      //   //dialogStack.value.pop();
      //   //next(false);
      //   break;
      // }
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
