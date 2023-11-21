<template>
  <q-page-container>
    <q-page class="q-pa-md">
      <div>{{ commonRoutes }}</div>
      <router-view :key="$route.fullPath"></router-view>
      <q-tab-panels v-model="tab" animated>
        <q-tab-panel v-for="item in tabItems" :key="item.name" :name="item.name">
          <p>
            {{ item.content }}
          </p>
        </q-tab-panel>
      </q-tab-panels>
    </q-page>
  </q-page-container>

  <q-footer bordered class="bg-grey-3 text-primary">
    <q-btn-toggle
      v-model="menuNav"
      toggle-color="primary"
      flat
      size="16px"
      text-color="grey-10"
      :options="[
        { label: $t('layout.menu.dashboard'), value: 'dashboard' },
        { label: $t('layout.menu.members'), value: 'members' },
        { label: $t('layout.menu.staff'), value: 'staff' },
        { label: $t('layout.menu.directories'), value: 'directories' },
        { label: $t('layout.menu.weather'), value: 'weather' },
        { label: $t('layout.menu.businesses'), value: 'businesses' },
        { label: $t('layout.menu.sites'), value: 'sites' }
      ]"
      @update:model-value="handleToggleUpdate"
    />
    <q-tabs
      no-caps
      active-color="primary"
      indicator-color="transparent"
      class="text-grey-8"
      v-model="tab"
    >
      <q-tab
        v-for="item in tabItems"
        :key="item.name"
        :name="item.name"
        :label="item.label"
        @click="navigateTo(item.name)"
      />
    </q-tabs>
  </q-footer>
</template>

<script setup lang="ts">
  // Vue Import
  import { ref } from "vue";
  import { useRouter } from "vue-router";
  //import { usePermissionStore } from "@/stores/permission";
  //import { useUserStore } from "@/stores/user";

  const tab = ref("images");
  const router = useRouter();
  const menuNav = ref("");

  const handleToggleUpdate = (newVal: any) => {
    switch (newVal) {
      case "dashboard":
        router.push("/dashboard");
        break;
      case "staff":
        router.push("/staff");
        break;
      case "members":
        router.push("/members");
        break;
      case "directories":
        router.push("/directories");
        break;
      case "weather":
        router.push("/weather");
        break;
      case "businesses":
        router.push("/businesses");
        break;
      case "sites":
        router.push("/sites");
        break;
      default:
        break;
    }
  };

  //   const tabItems = reactive([
  //     {
  //       name: "members",
  //       content: `Lorem ipsum dolor sit amet consectetur adipisicing elit. Fugit nihil praesentium
  //               molestias a adipisci, dolore vitae odit, quidem consequatur optio voluptates
  //               asperiores pariatur eos numquam rerum delectus commodi perferendis voluptate?`,
  //       label: "members"
  //     },
  //     {
  //       name: "videos",
  //       content: `Lorem ipsum dolor sit amet consectetur adipisicing elit.`,
  //       label: "Videos"
  //     },
  //     {
  //       name: "articles",
  //       content: `Lorem ipsum dolor sit amet consectetur adipisicing elit.`,
  //       label: "Articles"
  //     }
  //   ]);

  //   const navigateTo = (routeName: any) => {
  //     // Use the router to navigate to the specified route
  //     router.push({ name: routeName });
  //   };

  //const userStore = useUserStore();
  // const user = ref(userStore.user);
  // const roles = ref(userStore.roles);
  //   const permissionStore = usePermissionStore();
  //   const permissionRoutes = computed(() => permissionStore.permissionRoutes);

  //   const visibleRoutes = computed(() => {
  //     return permissionRoutes.value.filter((route: RouteRecordRaw) => {
  //       return route.path !== "/auth" && (!route.meta || !route.meta.hidden);
  //     });
  //   });

  //   const commonRoutes = computed(() => {
  //     return visibleRoutes.value.filter((route: RouteRecordRaw) => route.meta?.group == "common");
  //   });

  // const manageUsersRoutes = computed(() => {
  //   return visibleRoutes.value.filter(
  //     (route: RouteRecordRaw) => route.meta?.group == "manageUsers"
  //   );
  // });

  // const moreRoutes = computed(() => {
  //   return visibleRoutes.value.filter((route: RouteRecordRaw) => route.meta?.group == "more");
  // });

  // const isAdmin = computed(() => {
  //   return (roles.value as Array<string>).includes("cs_admin");
  // });
</script>
