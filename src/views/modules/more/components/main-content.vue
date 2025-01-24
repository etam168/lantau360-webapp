<template>
  <q-table
    v-bind="$attrs"
    flat
    hide-header
    hide-pagination
    separator="cell"
    :rows
    :row-key
    :rows-per-page-options="[0]"
  >
    <template v-slot:top>
      <app-more-page-logoff v-if="userStore.isUserLogon()" class="full-width" />
      <app-more-page-logon v-else @on-auth-dialog="handleAuthDialog" class="full-width" />
    </template>

    <template v-slot:body="{ row }">
      <q-tr>
        <q-td colspan="100%">
          <app-menu-item-member
            :type="row.type"
            :icon="row.icon!"
            :title="row.title"
            @on-item-click="onItemClick(row.name)"
          />
        </q-td>
      </q-tr>
    </template>

    <template v-slot:bottom>
      <app-more-page-footer class="full-width" />
    </template>
  </q-table>
</template>

<script setup lang="ts">
  import { newMember } from "@/interfaces/models/entities/member";
  import { EntityURLKey, ICONS } from "@/constants";
  import { useUserStore } from "@/stores/user";

  // Props
  const { i18nKey = "more" } = defineProps<{ i18nKey?: string }>();

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

  const rowKey = "name";
  const rows = computed(() => {
    const baseMenuItems = [
      { name: "language", type: "language", icon: ICONS.SETTING },
      { name: "terms", type: "moreItem", icon: ICONS.TNC },
      { name: "privacy", type: "moreItem", icon: ICONS.PRIVACY }
    ];

    const menuItems = userStore.isUserLogon()
      ? [
          ...baseMenuItems,
          { name: "profile", type: "moreItem", icon: ICONS.PROFILE },
          { name: "account", type: "moreItem", icon: ICONS.ACCOUNT }
        ]
      : baseMenuItems;

    return menuItems.map(item => ({
      ...item,
      title: `${i18nKey}.mainMenu.${item.name}`
    })) as RenderItem[];
  });

  function handleAuthDialog(tabValue: string) {
    openAuthDialog(isDialogOpen, tabValue);
  }

  function handleContentDialog(name: string) {
    openContentDialog(isDialogOpen, isLoading, name);
  }

  function handleProfileDialog(entityKey: EntityURLKey, itemName: string) {
    handleOpenDialog({}, isDialogOpen, entityKey, "edit");
  }

  function handleTransactionDialog(entityKey: EntityURLKey, itemName: string) {
    member.memberId = userStore.userInfo.userId;
    openTransactionItemDialog(isDialogOpen, member, entityKey);
  }
</script>

<style scoped>
  .q-table__top {
    padding: 0 !important;
  }
</style>
