<template>
  <q-page>
    <app-page-title :title="$t(`${i18nKey}.title`)"></app-page-title>

    <q-card-section class="q-gutter-md">
      <template v-for="(item, index) in renderItems" :key="index">
        <more-page-language v-if="item.type === 'language'" />
        <more-page-logoff v-if="item.type === 'logoff'" @on-dialog="throttledHandleLoginDialog" />
        <more-page-logon v-if="item.type === 'logon'" @on-dialog="throttledHandleLoginDialog" />

        <more-page-item
          v-if="item.type === 'moreItem'"
          :icon="item.icon"
          :title="item.title"
          @on-item-click="onItemClick(item)"
        />
      </template>
    </q-card-section>
<!-- 
    <q-card-section>
      <app-button-outline @click="handleInstall"> Install App</app-button-outline>
    </q-card-section> -->

    <more-page-footer />
  </q-page>
</template>

<script setup lang="ts">
  import { throttle } from "quasar";
  import { useUserStore } from "@/stores/user";
  import { EntityURLKey, ICONS } from "@/constants";

  const $q = useQuasar();
  const userStore = useUserStore();
  const { eventBus } = useUtilities();
  const { fetchTransactionData } = useTransactionsFunctions();
  const { handleOpenDialog } = useEntityDataHandlingService();

  const throttledHandleLoginDialog = throttle(showLoginDialog, 2000);

  const i18nKey = "more";
  const isDialogOpen = ref(false);
  const lookUpEntityTypes = ["MEMBER"];

  interface RenderItem {
    name: string;
    icon?: string;
    title?: string;
    type: "language" | "logoff" | "logon" | "moreItem";
  }

  const renderItems = computed((): RenderItem[] => {
    switch (userStore.isUserLogon()) {
      case true:
        return [
          { name: "logoff", type: "logoff" },
          { name: "language", type: "language" },
          { name: "terms", type: "moreItem", icon: ICONS.TNC, title: `${i18nKey}.terms` },
          { name: "privacy", type: "moreItem", icon: ICONS.PRIVACY, title: `${i18nKey}.privacy` },
          { name: "profile", type: "moreItem", icon: ICONS.PROFILE, title: `${i18nKey}.profile` },
          { name: "account", type: "moreItem", icon: ICONS.ACCOUNT, title: `${i18nKey}.account` },
          { name: "checkIn", type: "moreItem", icon: ICONS.PRIVACY, title: `${i18nKey}.checkin` }
        ];

      default:
        return [
          { name: "logon", type: "logon" },
          { name: "language", type: "language" },
          { name: "privacy", type: "moreItem", icon: ICONS.PRIVACY, title: `${i18nKey}.privacy` },
          { name: "terms", type: "moreItem", icon: ICONS.TNC, title: `${i18nKey}.terms` }
        ];
    }
  });

  function handleInstall() {
    alert("handleInstall");
  }

  const onItemClick = (item: any) => {
    const { name } = item;
    alert(JSON.stringify(name));
    let component;
    let props;
    let entityKey;

    switch (name) {
      case "profile":
        entityKey = "MEMBER" as EntityURLKey;
        props = { category: item, entityKey: entityKey };
        component = defineAsyncComponent(
          () => import("@/components/dialog/generic-gallery-input-dialog/index.vue")
        );
        handleOpenDialog(
          undefined,
          component,
          component,
          props,
          isDialogOpen.value,
          lookUpEntityTypes,
          entityKey
        );
        break;

      case "account":
        handleMoreDialog(name);
        break;

      case "privacy":
      case "terms":
        handleMoreDialog(name);
        break;

      default:
        break;
    }
  };

  function handleMoreDialog(name: string) {
    $q.dialog({
      component: defineAsyncComponent(
        () => import("@/components/dialog/more-detail-dialog/index.vue")
      ),
      componentProps: {
        contentName: name
      }
    });
  }

  function showLoginDialog(tabValue: string) {
    alert("YES");
    $q.dialog({
      component: defineAsyncComponent(() => import("@/views/auth/login-dialog.vue")),
      componentProps: {
        tabValue: tabValue,
        callback: fetchTransactionData
      }
    });
  }

  onMounted(() => {
    $q.notify({
      message: "Install App",
      color: "primary",
      actions: [
        {
          label: "Install",
          color: "white",
          handler: () => {
            handleInstall();
          }
        }
      ]
    });

    eventBus.on("refresh-transaction-data", () => {
      fetchTransactionData();
    });
  });

  fetchTransactionData();
</script>
