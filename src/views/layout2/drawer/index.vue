<template>
  <q-drawer show-if-above v-model="drawerOpen" side="left" bordered>
    <q-scroll-area class="fit">
      <drawer-avatar :userName="user" />

      <q-list class="q-mb-md">
        <q-separator />
        <drawer-menuitems :route-list="commonRoutes" />

        <q-separator />
        <drawer-menuitems :route-list="manageUsersRoutes" group-title="admin" v-if="isAdmin" />

        <q-separator />
        <drawer-menuitems :route-list="moreRoutes" group-title="more" />
      </q-list>
    </q-scroll-area>
  </q-drawer>
</template>

<script setup lang="ts">
  // Vue Import
  import { ref, computed, onBeforeUnmount, onMounted } from "vue";

  import { RouteRecordRaw } from "vue-router";
  import { usePermissionStore } from "@/stores/permission";
  import { useUserStore } from "@/stores/user";

  import eventBus from "@/utils/event-bus";
  import DrawerAvatar from "./drawer-avatar.vue";
  import DrawerMenuitems from "./drawer-menuitems.vue";

  const drawerOpen = ref(false);

  const userStore = useUserStore();
  const user = ref(userStore.user);
  const roles = ref(userStore.roles);
  const permissionStore = usePermissionStore();
  const permissionRoutes = computed(() => permissionStore.permissionRoutes);

  const visibleRoutes = computed(() => {
    return permissionRoutes.value.filter((route: RouteRecordRaw) => {
      return route.path !== "/auth" && (!route.meta || !route.meta.hidden);
    });
  });

  const commonRoutes = computed(() => {
    return visibleRoutes.value.filter((route: RouteRecordRaw) => route.meta?.group == "common");
  });

  const manageUsersRoutes = computed(() => {
    return visibleRoutes.value.filter(
      (route: RouteRecordRaw) => route.meta?.group == "manageUsers"
    );
  });

  const moreRoutes = computed(() => {
    return visibleRoutes.value.filter((route: RouteRecordRaw) => route.meta?.group == "more");
  });

  const isAdmin = computed(() => {
    return (roles.value as Array<string>).includes("cs_admin");
  });

  const toggleDrawer = () => {
    drawerOpen.value = !drawerOpen.value;
  };

  onMounted(() => {
    eventBus.on("toggle-drawer", toggleDrawer);
  });

  onBeforeUnmount(() => {
    eventBus.off("toggle-drawer");
  });
</script>
