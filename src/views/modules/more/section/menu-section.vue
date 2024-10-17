<!-- MenuSection.vue -->
<template>
  <q-card-section class="q-pt-none q-qb-xl">
    <q-item v-for="(item, index) in menuItems" :key="index" class="shadow-1 q-mb-md q-pl-sm">
      <q-item-section avatar>
        <q-avatar size="36px" square>
          <img :src="item.icon" />
        </q-avatar>
      </q-item-section>

      <q-item-section>
        <q-item-label class="text-subtitle1 text-weight-medium">
          {{ $t(item.title) }}
        </q-item-label>
      </q-item-section>

      <q-item-section side v-if="item.name === MENU.LANGUAGE">
        <language-select />
      </q-item-section>
      <q-item-section side v-else>
        <q-btn
          dense
          flat
          round
          icon="mdi-chevron-right"
          v-close-popup
          @click="throttledHandleContentDialog(item)"
        ></q-btn>
      </q-item-section>
    </q-item>
  </q-card-section>
</template>

<script setup lang="ts">
  import { LOGGED_ON_USER_MENU, DEFAULT_MENU, MENU } from "@/constants";
  import { useUserStore } from "@/stores/user";

  const userStore = useUserStore();

  // Define types for menu items
  interface MenuItem {
    name: string;
    title: string;
    icon: string;
  }

  // Props
  const { throttledHandleContentDialog } = defineProps<{
    throttledHandleContentDialog: (item: MenuItem) => void;
  }>();

  const menuItems = computed(() => {
    return userStore.isUserLogon() ? LOGGED_ON_USER_MENU : DEFAULT_MENU;
  });
</script>
