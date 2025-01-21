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
  import {
    fasEllipsis,
    fasHeart,
    fasHouse,
    fasMoneyCheckDollar,
    fasPeopleGroup
  } from "@quasar/extras/fontawesome-v6";

  const { t } = useI18n();
  const router = useRouter();
  const ACTIVE_TAB_KEY = "activeTab";

  const tab = ref(sessionStorage.getItem(ACTIVE_TAB_KEY) || "home");

  const navigateTo = (route: string, tabName: string) => {
    router.push(route);
    tab.value = tabName;
    sessionStorage.setItem(ACTIVE_TAB_KEY, tabName);
  };

  const tabs = computed(() => [
    { name: "home", icon: fasHouse, label: t("footer.home"), route: "/home" },
    {
      name: "business",
      icon: fasMoneyCheckDollar,
      label: t("footer.business"),
      route: "/business"
    },
    {
      name: "community",
      icon: fasPeopleGroup,
      label: t("footer.community"),
      route: "/community"
    },
    {
      name: "favourites",
      icon: fasHeart,
      label: t("footer.favourite"),
      route: "/favourite"
    },

    { name: "more", icon: fasEllipsis, label: t("footer.more"), route: "/more" }
  ]);

  onMounted(() => {
    const storedTab = sessionStorage.getItem(ACTIVE_TAB_KEY);
    if (storedTab && tabs.value.some(tab => tab.name === storedTab)) {
      tab.value = storedTab;
    }
  });
</script>
