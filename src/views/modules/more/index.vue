<template>
  <q-page>
    <app-page-title :title="$t(`${i18nKey}.title`)"></app-page-title>

    <q-card-section class="q-gutter-md">
      <template v-for="(item, index) in renderItems" :key="index">
        <more-page-logoff v-if="item.type === 'logoff'" />
        <more-page-logon v-if="item.type === 'logon'" @on-auth-dialog="handleAuthDialog" />

        <more-page-item
          v-if="['moreItem', 'language'].includes(item.type)"
          :ref="el => setItemRef(item.name, el)"
          :type="item.type"
          :icon="item.icon!"
          :title="item.title"
          @on-item-click="onItemClick(item.name)"
        />
      </template>
    </q-card-section>

    <more-page-footer />
  </q-page>
</template>

<script setup lang="ts">
  // Interface files
  import { newMember } from "@/interfaces/models/entities/member";

  // Constants
  import { EntityURLKey, ICONS } from "@/constants";

  // Stores
  import { useUserStore } from "@/stores/user";
  import { useFavoriteStore } from "@/stores/favorite-store";

  const $q = useQuasar();
  const userStore = useUserStore();
  const favStore = useFavoriteStore();
  const { eventBus } = useUtilities();
  const { handleOpenDialog } = useEntityDataHandlingService();

  const {
    openContentDialog,
    openMemberItemDialog,
    fetchTransactionData,
    openTransactionItemDialog
  } = useMemberItemDialogService();

  const i18nKey = "more";
  const isDialogOpen = ref(false);

  interface RenderItem {
    name: string;
    icon?: string;
    title?: string;
    type: "language" | "logoff" | "logon" | "moreItem";
  }

  const MORE_ITEMS: Record<string, Partial<RenderItem>> = {
    account: { type: "moreItem", icon: ICONS.ACCOUNT, title: `${i18nKey}.mainMenu.account` },
    checkIn: { type: "moreItem", icon: ICONS.PRIVACY, title: `${i18nKey}.mainMenu.myCheckin` },
    language: { type: "language", icon: ICONS.SETTING, title: `${i18nKey}.mainMenu.language` },
    logon: { type: "logon", title: `${i18nKey}.mainMenu.logon}` },
    logoff: { type: "logoff", title: `${i18nKey}.mainMenu.logoff}` },
    privacy: { type: "moreItem", icon: ICONS.PRIVACY, title: `${i18nKey}.mainMenu.privacy` },
    profile: { type: "moreItem", icon: ICONS.PROFILE, title: `${i18nKey}.mainMenu.profile` },
    terms: { type: "moreItem", icon: ICONS.TNC, title: `${i18nKey}.mainMenu.terms` }
  };

  type MoreItemKey = keyof typeof MORE_ITEMS;

  // Usage with name
  const getItem = (key: MoreItemKey) => {
    // we can get the name from the key
    return { name: key, ...MORE_ITEMS[key] };
  };

  const renderItems = computed(() => {
    const items = userStore.isUserLogon()
      ? ["logoff", "language", "terms", "privacy", "profile", "account", "checkIn"]
      : ["logon", "language", "privacy", "terms"];

    return items.map(key => getItem(key)) as RenderItem[];
  });

  const member = newMember;

  const onItemClick = (itemName: string) => {
    switch (itemName) {
      case "profile":
        handleProfileDialog("MEMBER", itemName);
        break;
      case "privacy":
      case "terms":
        handleContentDialog(itemName);
        break;
      case "account":
        handleTransactionDialog("ACCOUNT", itemName);
        break;
      case "checkIn":
        handleMemberDialog("CHECKIN", itemName);
        break;
      default:
        break;
    }
  };

  const dialogStack = ref<string[]>([]);
  const isLoading = ref(false);
  const itemRefs = ref<{ [key: string]: any }>({});

  const setItemRef = (name: string, el: any) => {
    if (el) {
      itemRefs.value[name] = el;
    }
  };

  function handleTransactionDialog(entityKey: EntityURLKey, itemName: string) {
    isLoading.value = true;
    member.memberId = userStore.userId;
    const dialogName = "accountDetail";
    const props = { dialogName: dialogName };
    eventBus("DialogStatus").emit(true, dialogName);

    if (!isDialogOpen.value) {
      openTransactionItemDialog(props, isDialogOpen, member, entityKey);
      resetItemLoading(itemName);
    }
  }

  function handleMemberDialog(entityKey: EntityURLKey, itemName: string) {
    isLoading.value = true;
    member.memberId = userStore.userId;
    const dialogName = "checkinDetail";
    const props = { dialogName: dialogName };
    eventBus("DialogStatus").emit(true, dialogName);
    if (!isDialogOpen.value) {
      openMemberItemDialog(props, isDialogOpen, member, entityKey);
      resetItemLoading(itemName);
    }
  }

  function handleProfileDialog(entityKey: EntityURLKey, itemName: string) {
    const dialogName = "profileDetail";
    const props = { dialogName: dialogName };
    if (!isDialogOpen.value) {
      eventBus("DialogStatus").emit(true, dialogName);
      handleOpenDialog(props, isDialogOpen, entityKey, "edit");
      resetItemLoading(itemName);
    }
  }

  function handleContentDialog(name: string) {
    openContentDialog(isLoading, name, resetItemLoading);
    resetItemLoading(name);
  }

  function resetItemLoading(name: string) {
    const item = itemRefs.value[name];
    if (item && typeof item.resetLoading === "function") {
      item.resetLoading();
    }
  }

  function handleAuthDialog(tabValue: string) {
    isLoading.value = true;
    $q.dialog({
      component: defineAsyncComponent(() => import("@/components/dialog/auth-dialog/index.vue")),
      componentProps: {
        mode: tabValue
      }
    });
  }

  onMounted(() => {
    eventBus("refresh-transaction-data").on(() => {
      fetchTransactionData();
    });

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
        favStore.syncRemoteFromLocal();
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
