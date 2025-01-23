<template>
  <q-table v-bind="$attrs" flat grid hide-header hide-pagination :rows :rows-per-page-options="[0]">
    <template v-slot:top>
      <div v-if="rows.some(row => row.type === 'logoff')">
        <app-more-page-logoff />
      </div>
      <div v-if="rows.some(row => row.type === 'logon')">
        <app-more-page-logon @on-auth-dialog="handleAuthDialog" />
      </div>
    </template>

    <template v-slot:item="{ row }">
      <app-menu-item-member
        v-if="['moreItem', 'language'].includes(row.type)"
        :ref="(el: any) => setItemRef(row.name, el)"
        :type="row.type"
        :icon="row.icon!"
        :title="row.title"
        @on-item-click="onItemClick(row.name)"
      />
    </template>

    <template v-slot:bottom> <app-more-page-footer /></template>
  </q-table>
</template>

<script setup lang="ts">
  import { useUserStore } from "@/stores/user";

  // Interface files
  import { newMember } from "@/interfaces/models/entities/member";

  // Constants
  import { EntityURLKey, ICONS } from "@/constants";

  // Props
  const { i18nKey = "" } = defineProps<{
    i18nKey?: string;
  }>();

  const { handleOpenDialog } = useEntityDataHandlingService();

  const { openContentDialog, fetchTransactionData, openTransactionItemDialog } =
    useMemberItemDialogService();

  const $q = useQuasar();
  const userStore = useUserStore();
  const isDialogOpen = ref(false);

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
      default:
        break;
    }
  };

  const isLoading = ref(false);
  const itemRefs = ref<{ [key: string]: any }>({});

  const setItemRef = (name: string, el: any) => {
    if (el) {
      itemRefs.value[name] = el;
    }
  };

  interface RenderItem {
    name: string;
    icon?: string;
    title?: string;
    type: "language" | "logoff" | "logon" | "moreItem";
  }

  const rows = computed(() => {
    switch (userStore.isUserLogon()) {
      case true:
        return [
          {
            name: "logoff",
            type: "logoff",
            title: `${i18nKey}.mainMenu.logoff}`
          },
          {
            name: "language",
            type: "language",
            icon: ICONS.SETTING,
            title: `${i18nKey}.mainMenu.language`
          },
          {
            name: "terms",
            type: "moreItem",
            icon: ICONS.TNC,
            title: `${i18nKey}.mainMenu.terms`
          },
          {
            name: "privacy",
            type: "moreItem",
            icon: ICONS.PRIVACY,
            title: `${i18nKey}.mainMenu.privacy`
          },
          {
            name: "profile",
            type: "moreItem",
            icon: ICONS.PROFILE,
            title: `${i18nKey}.mainMenu.profile`
          },
          {
            name: "account",
            type: "moreItem",
            icon: ICONS.ACCOUNT,
            title: `${i18nKey}.mainMenu.account`
          }
        ];
      case false:
        return [
          {
            name: "logon",
            type: "logon",
            title: `${i18nKey}.mainMenu.logon}`
          },
          {
            name: "language",
            type: "language",
            icon: ICONS.SETTING,
            title: `${i18nKey}.mainMenu.language`
          },
          {
            name: "privacy",
            type: "moreItem",
            icon: ICONS.PRIVACY,
            title: `${i18nKey}.mainMenu.privacy`
          },
          {
            name: "terms",
            type: "moreItem",
            icon: ICONS.TNC,
            title: `${i18nKey}.mainMenu.terms`
          }
        ];
    }
  }) as ComputedRef<RenderItem[]>;

  function handleAuthDialog(tabValue: string) {
    isLoading.value = true;
    $q.dialog({
      component: defineAsyncComponent(() => import("@/components/dialog/auth-dialog/index.vue")),
      componentProps: {
        mode: tabValue
      }
    });
  }

  function handleTransactionDialog(entityKey: EntityURLKey, itemName: string) {
    isLoading.value = true;
    member.memberId = userStore.userInfo.userId;

    if (!isDialogOpen.value) {
      openTransactionItemDialog(isDialogOpen, member, entityKey);
      resetItemLoading(itemName);
    }
  }

  function handleProfileDialog(entityKey: EntityURLKey, itemName: string) {
    if (!isDialogOpen.value) {
      handleOpenDialog({}, isDialogOpen, entityKey, "edit");
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
</script>

<style scoped>
  .q-table__top {
    padding: 0 !important;
  }
</style>
