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
  import { newMember } from "@/interfaces/models/entities/member";
  import { useUserStore } from "@/stores/user";
  import { EntityURLKey, ICONS } from "@/constants";

  const userStore = useUserStore();
  const { eventBus } = useUtilities();
  const { fetchTransactionData } = useTransactionsFunctions();
  const { handleOpenDialog } = useEntityDataHandlingService();
  const { openAuthDialog, openContentDialog, openMemberItemDialog, openTransactionDialog } =
    useMoreItemService();

  const i18nKey = "more";
  const isDialogOpen = ref(false);

  interface RenderItem {
    name: string;
    icon?: string;
    title?: string;
    type: "language" | "logoff" | "logon" | "moreItem";
  }

  const ITEMS: Record<string, RenderItem> = {
    account: {
      name: "account",
      type: "moreItem",
      icon: ICONS.ACCOUNT,
      title: `${i18nKey}.account.title`
    },
    checkin: {
      name: "checkIn",
      type: "moreItem",
      icon: ICONS.PRIVACY,
      title: `${i18nKey}.checkin.title`
    },
    language: {
      name: "language",
      icon: ICONS.SETTING,
      type: "language",
      title: `${i18nKey}.language`
    },
    logon: { name: "logon", type: "logon" },
    logoff: { name: "logoff", type: "logoff" },
    privacy: {
      name: "privacy",
      type: "moreItem",
      icon: ICONS.PRIVACY,
      title: `${i18nKey}.privacy`
    },
    propfile: {
      name: "profile",
      type: "moreItem",
      icon: ICONS.PROFILE,
      title: `${i18nKey}.profile`
    },
    terms: { name: "terms", type: "moreItem", icon: ICONS.TNC, title: `${i18nKey}.terms` }
  };

  const renderItems = computed((): RenderItem[] => {
    switch (userStore.isUserLogon()) {
      case true:
        return [
          ITEMS.logoff,
          ITEMS.language,
          ITEMS.terms,
          ITEMS.privacy,
          ITEMS.propfile,
          ITEMS.account,
          ITEMS.checkIn
        ];
      default:
        return [ITEMS.logon, ITEMS.language, ITEMS.privacy, ITEMS.terms];
    }
  });

  // const renderItems = computed(() =>
  //   userStore.isUserLogon()
  //     ? [
  //         ITEMS.logoff,
  //         ITEMS.language,
  //         ITEMS.terms,
  //         ITEMS.privacy,
  //         ITEMS.propfile,
  //         ITEMS.account,
  //         ITEMS.checkIn
  //       ]
  //     : [ITEMS.logon, ITEMS.language, ITEMS.privacy, ITEMS.terms]
  // );

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

    if (!isDialogOpen.value) {
      openTransactionDialog(isDialogOpen, member, entityKey);
      resetItemLoading(itemName);
    }
  }

  function handleMemberDialog(entityKey: EntityURLKey, itemName: string) {
    isLoading.value = true;
    member.memberId = userStore.userId;

    if (!isDialogOpen.value) {
      openMemberItemDialog(isDialogOpen, member, entityKey);
      resetItemLoading(itemName);
    }
  }

  function handleProfileDialog(entityKey: EntityURLKey, itemName: string) {
    const props = { dialogName: itemName };
    if (!isDialogOpen.value) {
      handleOpenDialog(props, isDialogOpen, entityKey, "edit");
      resetItemLoading(itemName);
    }
  }

  function handleContentDialog(itemName: string) {
    if (!isDialogOpen.value) {
      openContentDialog(itemName, isDialogOpen, isLoading);
      resetItemLoading(itemName);
    }
    // isLoading.value = true;
    // eventBus("DialogStatus").emit(true, name);
    // $q.dialog({
    //   component: defineAsyncComponent(
    //     () => import("@/components/dialog/more-detail-dialog/index.vue")
    //   ),
    //   componentProps: { contentName: name, isLoading: isLoading, dialogName: name }
    // })
    //   .onCancel(() => {
    //     isLoading.value = false;
    //     resetItemLoading(name);
    //   })
    //   .onOk(() => {
    //     resetItemLoading(name);
    //   });
  }

  function resetItemLoading(name: string) {
    const item = itemRefs.value[name];
    if (item && typeof item.resetLoading === "function") {
      item.resetLoading();
    }
  }

  function handleAuthDialog(tabValue: string) {
    isLoading.value = true;
    openAuthDialog(tabValue, isLoading);
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
    if (dialogStack.value.length > 0) {
      const emitter = dialogStack.value[dialogStack.value.length - 1];
      eventBus(emitter).emit();
      dialogStack.value.pop();
      next(false);
    } else {
      next();
    }
  });
</script>
