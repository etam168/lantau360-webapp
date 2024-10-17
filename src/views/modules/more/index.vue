<template>
  <q-page>
    <app-page-title :title="$t(`${i18nKey}.title`)"></app-page-title>

    <template v-for="(item, index) in renderItems" :key="index">
      <log-in-section v-if="item.type === 'login'" />
      <log-off-section v-if="item.type === 'logout'" @on-dialog="throttledHandleLoginDialog" />

      <language-section v-if="item.type === 'language'" />

      <app-more-item
        v-if="item.type === 'moreItem'"
        :icon="item.icon"
        :title="item.title"
        @on-item-click="handleDialog(item)"
      />

      <install-button v-else-if="item.type === 'install'" />
      <!-- <footer-section v-else-if="item.type === 'footer'" /> -->
    </template>
    <footer-section />
  </q-page>
</template>

<script setup lang="ts">
  import { throttle } from "quasar";
  import { useUserStore } from "@/stores/user";
  import { URL, MENU, ICONS } from "@/constants";
  import { useChangeCase } from "@vueuse/integrations/useChangeCase";

  // Custom Components
  import LogInSection from "./section/login-section.vue";
  import LogOffSection from "./section/logoff-section.vue";
  import languageSection from "./section/language-section.vue";
  import moreItemSection from "./section/more-item-section.vue";

  import FooterSection from "./section/footer-section.vue";
  import InstallButton from "./section/install-button.vue";

  import { Content } from "@/interfaces/models/entities/content";

  const $q = useQuasar();
  const { t } = useI18n({ useScope: "global" });

  const { eventBus } = useUtilities();
  const userStore = useUserStore();
  const error = ref<string | null>(null);
  const i18nKey = "more";

  const trHistory = ref();
  const trRecent = ref();
  const memberConfig = ref<Content>();
  const throttledHandleLoginDialog = throttle(showLoginDialog, 2000);

  interface RenderItem {
    name: string;
    icon?: string;
    title?: string;
    type: "moreItem" | "login" | "logout" | "language" | "install";
  }

  const renderItems = computed((): RenderItem[] => {
    switch (userStore.isUserLogon()) {
      case true:
        return [
          { name: "login", type: "login" },
          { name: "language", type: "language" },
          {
            name: "terms",
            type: "moreItem",
            icon: "./resources/icons/ic_terms_conditions.svg",
            title: "Terms & Conditions"
          },
          {
            name: "privacy",
            type: "moreItem",
            icon: "./resources/icons/ic_privacy.svg",
            title: "Privacy Policy"
          },
          {
            name: "profileSetting",
            type: "moreItem",
            icon: "./resources/icons/ic_privacy.svg",
            title: "Profile"
          },
          {
            name: "account",
            type: "moreItem",
            icon: "./resources/icons/ic_privacy.svg",
            title: "Account"
          },
          {
            name: "checkIn",
            type: "moreItem",
            icon: "./resources/icons/ic_privacy.svg",
            title: "My Check-In"
          },
          { name: "install", type: "install" }
        ];

      default:
        return [
          { name: "logout", type: "logout" },
          { name: "language", type: "language" },
          {
            name: "privacy",
            type: "moreItem",
            icon: "./resources/icons/ic_privacy.svg",
            title: "Privacy"
          },
          {
            name: "terms",
            type: "moreItem",
            icon: "./resources/icons/ic_terms_conditions.svg",
            title: "Terms & Conditions"
          },
          { name: "install", type: "install" }
        ];
    }
  });

  initTransactionData();

  onMounted(() => {
    eventBus.on("refresh-transaction-data", () => {
      initTransactionData();
    });
  });

  function handleDialog(item: any) {
    const contentKey = useChangeCase(item.name, "capitalCase").value;

    switch (item.name) {
      case MENU.PRIVACY:
      case MENU.TERMS:
        OpenDialog(
          import("./section/content-dialog.vue"),
          { title: t(item.title) },
          contentKey,
          "content"
        );
        break;

      case MENU.PROFILE:
        OpenDialog(import("./section/profile-setting-dialog.vue"), undefined, undefined, "profile");
        break;

      case MENU.CHECKIN:
        OpenDialog(import("./section/profile-checkin-dialog.vue"), undefined);
        break;

      case MENU.ACCOUNT:
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
        break;

      default:
        // Handle any other cases if needed
        break;
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
