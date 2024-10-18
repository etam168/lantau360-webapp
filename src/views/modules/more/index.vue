<template>
  <q-page>
    <app-page-title :title="$t(`${i18nKey}.title`)"></app-page-title>

    <q-card-section>
      <template v-for="(item, index) in renderItems" :key="index">
        <language-section v-if="item.type === 'language'" />
        <log-in-section v-if="item.type === 'login'" />
        <log-off-section v-if="item.type === 'logout'" @on-dialog="throttledHandleLoginDialog" />

        <app-more-item
          v-if="item.type === 'moreItem'"
          :icon="item.icon"
          :title="item.title"
          @on-item-click="onItemClick(item)"
        />

        <!-- <install-button v-if="item.type === 'install'" /> -->
      </template>
    </q-card-section>

    <q-card-section class="q-py-none">
      <app-button-outline @click="handleInstall"> Install App</app-button-outline>
    </q-card-section>

    <footer-section />
  </q-page>
</template>

<script setup lang="ts">
  import { throttle } from "quasar";
  import { useUserStore } from "@/stores/user";
  import { EntityURLKey } from "@/constants";

  // Custom Components
  import languageSection from "./components/language-section.vue";
  import LogInSection from "./components/login-section.vue";
  import LogOffSection from "./components/logoff-section.vue";
  import FooterSection from "./components/footer-section.vue";

  const $q = useQuasar();
  const { eventBus } = useUtilities();
  const userStore = useUserStore();
  const { fetchTransactionData } = useTransactionsFunctions();
  const throttledHandleLoginDialog = throttle(showLoginDialog, 2000);

  const { handleOpenDialog } = useEntityDataHandlingService();

  const i18nKey = "more";
  const isDialogOpen = ref(false);
  const lookUpEntityTypes = ["MEMBER"];

  interface RenderItem {
    name: string;
    icon?: string;
    title?: string;
    type: "moreItem" | "login" | "logout" | "language" | "install";
  }

  const iconTerms = "./resources/icons/ic_terms_conditions.svg";
  const iconPrivacy = "./resources/icons/ic_privacy.svg";

  const renderItems = computed((): RenderItem[] => {
    switch (userStore.isUserLogon()) {
      case true:
        return [
          { name: "login", type: "login" },
          { name: "language", type: "language" },
          { name: "terms", type: "moreItem", icon: iconTerms, title: `${i18nKey}.terms` },
          { name: "privacy", type: "moreItem", icon: iconPrivacy, title: `${i18nKey}.privacy` },
          { name: "profile", type: "moreItem", icon: iconPrivacy, title: `${i18nKey}.profile` },
          { name: "account", type: "moreItem", icon: iconPrivacy, title: `${i18nKey}.account` },
          { name: "checkIn", type: "moreItem", icon: iconPrivacy, title: `${i18nKey}.checkin` },
          { name: "install", type: "install" }
        ];

      default:
        return [
          { name: "logout", type: "logout" },
          { name: "language", type: "language" },
          { name: "privacy", type: "moreItem", icon: iconPrivacy, title: `${i18nKey}.privacy` },
          { name: "terms", type: "moreItem", icon: iconTerms, title: `${i18nKey}.terms` },
          { name: "install", type: "install" }
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
    $q.dialog({
      component: defineAsyncComponent(() => import("@/views/auth/login-dialog.vue")),
      componentProps: {
        tabValue: tabValue,
        callback: fetchTransactionData
      }
    });
  }

  onMounted(() => {
    eventBus.on("refresh-transaction-data", () => {
      fetchTransactionData();
    });
  });

  fetchTransactionData();
</script>
