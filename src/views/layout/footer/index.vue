<template>
  <q-footer bordered class="bg-white text-primary q-py-sm">
    <q-tabs
      v-model="tab"
      active-color="primary"
      align="justify"
      class="text-grey"
      indicator-color="transparent"
      dense
      no-caps
    >
      <q-tab
        v-for="item in tabs"
        :key="item.name"
        :name="item.name"
        :icon="item.icon"
        :label="item.label"
        class="icon-size q-py-none q-px-xs"
        @click="navigateTo(item.route, item.name)"
      />
    </q-tabs>
  </q-footer>
</template>

<script setup lang="ts">
  const { t } = useI18n();
  const router = useRouter();
  const { eventBus } = useUtilities();
  const ACTIVE_TAB_KEY = "activeTab";

  const tab = ref(sessionStorage.getItem(ACTIVE_TAB_KEY) || "home");

  const navigateTo = (route: string, tabName: string) => {
    router.push(route);
    tab.value = tabName;
    sessionStorage.setItem(ACTIVE_TAB_KEY, tabName);
  };

  const tabs = computed(() => [
    { name: "home", icon: "fas fa-home", label: t("footer.home"), route: "/home" },
    {
      name: "business",
      icon: "fa-solid fa-money-check-dollar",
      label: t("footer.business"),
      route: "/business"
    },
    {
      name: "community",
      icon: "fa-solid fa-people-group",
      label: t("footer.community"),
      route: "/community"
    },
    {
      name: "favourites",
      icon: "fa-solid fa-heart",
      label: t("footer.favourite"),
      route: "/favourite"
    },

    { name: "more", icon: "fa-solid fa-ellipsis", label: t("footer.more"), route: "/more" }
  ]);

  onMounted(() => {
    const storedTab = sessionStorage.getItem(ACTIVE_TAB_KEY);
    if (storedTab && tabs.value.some(tab => tab.name === storedTab)) {
      tab.value = storedTab;
    }

    eventBus.on("navigateToMore", () => {
      // Navigate to "/more" when the event is received
      navigateTo("/more", "more");
    });
  });
</script>
