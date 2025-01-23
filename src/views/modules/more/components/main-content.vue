<template>
  <q-table v-bind="$attrs" flat grid hide-header hide-pagination :rows :rows-per-page-options="[0]">
    <template v-slot:top>
      <app-more-page-logoff v-if="userStore.isUserLogon()" />
      <app-more-page-logon v-else @on-auth-dialog="handleAuthDialog" />
    </template>

    <template v-slot:item="{ row }">
      <app-menu-item-member
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

  const { openContentDialog, openAuthDialog, openTransactionItemDialog } =
    useMemberItemDialogService();

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
    openAuthDialog(isDialogOpen, tabValue);
  }

  function handleTransactionDialog(entityKey: EntityURLKey, itemName: string) {
    member.memberId = userStore.userInfo.userId;
    openTransactionItemDialog(isDialogOpen, member, entityKey);
  }

  function handleProfileDialog(entityKey: EntityURLKey, itemName: string) {
    handleOpenDialog({}, isDialogOpen, entityKey, "edit");
  }

  function handleContentDialog(name: string) {
    openContentDialog(isDialogOpen, isLoading,name);
  }
</script>

<style scoped>
  .q-table__top {
    padding: 0 !important;
  }
</style>
