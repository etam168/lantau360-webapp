<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <q-header elevated class="bg-primary text-white items-center row" style="height: 64px">
    <q-toolbar>
      <q-btn dense flat round :icon="toggleNavbarIcon" @click="onClick" />

      <q-toolbar-title> Lantau360 Admin</q-toolbar-title>
      <q-space />

      <language-select class="q-mr-md" />

      <div class="q-ml-sm row items-center no-wrap">
        <q-btn round flat icon="mdi-power" @click="logout"
          ><q-tooltip class="bg-dark text-caption shadow-4">Logout</q-tooltip></q-btn
        >
      </div>
    </q-toolbar>
  </q-header>
</template>

<script setup lang="ts">
  // Vue Import
  import { computed } from "vue";
  import { useRouter } from "vue-router";
  import { useSettingsStore } from "@/stores/settings";
  import { useUserStore } from "@/stores/user";
  import LanguageSelect from "@/components/custom/language-select.vue";

  const settingsStore = useSettingsStore();
  const userStore = useUserStore();
  const router = useRouter();

  const navbarShow = computed(() => settingsStore.navbarShow);
  const toggleNavbarIcon = computed(() => {
    return navbarShow.value ? "mdi-format-indent-decrease" : "mdi-format-indent-increase";
  });

  const logout = () => {
    userStore.LogOut();
    router.push("/auth/login");
  };

  const emit = defineEmits(["on-click"]);

  function onClick() {
    emit("on-click");
  }
</script>
