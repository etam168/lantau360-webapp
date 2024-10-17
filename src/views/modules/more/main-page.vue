<template>
  <q-page>
    <app-page-title :title="$t(`${i18nKey}.title`)"></app-page-title>
    <template v-for="(item, index) in renderItems" :key="index">
      <log-in-section v-if="item.type === 'login'" @on-dialog="throttledHandleLoginDialog" />
      <log-off-section v-if="item.type === 'logout'" @on-dialog="throttledHandleLoginDialog" />
      <menu-section
        v-else-if="item.type === 'menu'"
        :throttled-handle-content-dialog="throttledHandleContentDialog"
      />
      <install-button v-else-if="item.type === 'install'" />
      <footer-section v-else-if="item.type === 'footer'" />
    </template>
  </q-page>
</template>

<script setup lang="ts">
  import { throttle } from "quasar";
  import { useUserStore } from "@/stores/user";
  import { URL, MENU } from "@/constants";

  // Custom Components
  import FooterSection from "./section/footer-section.vue";
  import MenuSection from "./section/menu-section.vue";
  import InstallButton from "./section/install-button.vue";
  import LogOffSection from "./section/logoff-section.vue";

  import { Content } from "@/interfaces/models/entities/content";
  import LogInSection from "./section/login-section.vue";

  const $q = useQuasar();
  const { t } = useI18n({ useScope: "global" });

  const { eventBus } = useUtilities();
  const userStore = useUserStore();
  const error = ref<string | null>(null);
  const i18nKey = "more";

  const trHistory = ref();
  const trRecent = ref();
  const memberConfig = ref<Content>();
  const throttledHandleContentDialog = throttle(showDialog, 2000);
  const throttledHandleLoginDialog = throttle(showLoginDialog, 2000);

  const key = computed( () => {
    return userStore.isUserLogon() ? "login" : "logout"
  });

  const renderItems = computed(() => {
    switch (key.value) {
      case "login":
        return [{ type: "login" }, { type: "menu" }, { type: "install" }, { type: "footer" }];
      case "logout":
        return [{ type: "logout" }, { type: "menu" }, { type: "install" }, { type: "footer" }];
      default:
        // Handle any unexpected cases
        return [];
    }
  });

  initTransactionData();

  onMounted(() => {
    eventBus.on("refresh-transaction-data", () => {
      initTransactionData();
    });
  });

  async function showDialog(item: any) {
    if (item.contentKey) {
      OpenDialog(
        import("./section/content-dialog.vue"),
        { title: t(item.title) },
        item.contentKey,
        "content"
      );
    } else if (item.name == MENU.PROFILE) {
      OpenDialog(import("./section/profile-setting-dialog.vue"), undefined, undefined, "profile");
    } else if (item.name == MENU.CHECKIN) {
      OpenDialog(import("./section/profile-checkin-dialog.vue"), undefined);
    } else if (item.name == MENU.ACCOUNT) {
      if (trHistory.value && trRecent.value) {
        OpenDialog(
          import("./section/profile-account-dialog/index.vue"),
          {
            trHistory: trHistory,
            trRecent: trRecent
          },
          "profile"
        );
      }
    }
  }

  function showLoginDialog(tabValue: string) {
    $q.dialog({
      component: defineAsyncComponent(() => import("@/views/auth/login-dialog.vue")),
      componentProps: {
        tabValue: tabValue,
        callback: initTransactionData
      }
    });
  }

  async function OpenDialog(
    component: any,
    componentProps?: any,
    contentKey?: string,
    requestType?: string
  ) {
    let requestUrl;
    switch (requestType) {
      case "content":
        requestUrl = `${URL.CONTENT_NAME_URL}/${contentKey}`;
        break;
      case "profile":
        requestUrl = `${URL.MEMBER_URL}/${userStore.userId}`;
        break;
      default:
        requestUrl = `${URL.CHECKIN_BY_MEMBER}/${userStore.userId}`;
        break;
    }
    const response = await axios.get(requestUrl).catch(err => {
      handleError(err);
    });

    $q.dialog({
      component: defineAsyncComponent(() => component),
      componentProps: {
        data: response?.data || [],
        ...componentProps
      }
    });
  }

  async function initTransactionData() {
    try {
      if (userStore.isUserLogon()) {
        const [transactionHistory, recentTransactions, memberConfigResponse] = await Promise.all([
          axios.get(`${URL.MEMBER_TRANSACTIONS_URL}/${userStore.userId}`),
          axios.get(`${URL.MEMBER_RECENT_RANSACTIONS_URL}/${userStore.userId}`),
          axios.get(URL.MEMBER_CONFIG)
        ]);

        trRecent.value = recentTransactions?.data ?? [];
        trHistory.value = transactionHistory?.data ?? [];
        memberConfig.value = memberConfigResponse.data;

        userStore.setPoints(
          memberConfig.value?.meta.postPoint ?? 50,
          memberConfig.value?.meta.requestFreePoints ?? 100
        );

        // Sync user points.
        userStore.fetchMemberPoints();
      }
    } catch (err) {
      handleError(err);
    }
  }

  function handleError(err: any) {
    if (err instanceof AxiosError) {
      if (err.response && err.response.status === 404) {
        error.value = t("errors.404");
      } else {
        error.value = t("errors.anErrorOccured");
      }
    } else {
      error.value = t("errors.anErrorOccured");
    }
  }
</script>
