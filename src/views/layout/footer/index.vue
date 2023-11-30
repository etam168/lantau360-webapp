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
        class="icon-size"
        @click="navigateTo(item.route)"
      />
    </q-tabs>
  </q-footer>
</template>

<script setup lang="ts">
  // Vue Import
  import { computed, ref } from "vue";
  import { useRouter } from "vue-router";

  // 3rd Party
  import { useI18n } from "vue-i18n";

  const { t } = useI18n();
  const router = useRouter();
  const tab = ref("home");

  const navigateTo = (route: string) => {
    router.push(route);
  };

  const tabs = computed(() => [
    { name: "home", icon: "fas fa-home", label: t("footer.home"), route: "/home" },
    {
      name: "business",
      icon: "fa-solid fa-money-check-dollar",
      label: t("footer.business"),
      route: "/businesses"
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
      route: "/favourites"
    },
    { name: "more", icon: "fa-solid fa-ellipsis", label: t("footer.more"), route: "/more" }
  ]);
</script>

<style scoped>
  .q-tab {
    padding: 0 4px; /* Adjust this value to your needs */
  }
</style>
