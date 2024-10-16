<template>
  <q-page>
    <app-page-title :title="$t(`${i18nKey}.title`)"></app-page-title>

    <login-signup @on-dialog="throttledHandleLoginDialog" />

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

        <q-item-section side v-if="item.name == MENU.LANGUAGE">
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

    <q-card-section v-if="shouldShowInstallButton()" class="q-pt-none">
      <q-btn rounded class="bg-primary text-white" @click="installApp">{{
        $t("notification.installApp")
      }}</q-btn>
    </q-card-section>

    <q-card-section v-if="$q.screen.height < 700" class="q-pt-none">
      <q-item-label class="text-center">{{ appVersion }}</q-item-label>
      <q-item-label class="text-center">{{ copyright }}</q-item-label>
    </q-card-section>

    <q-page-sticky position="bottom" :offset="[0, 18]" v-else>
      <q-item-label class="text-center">{{ appVersion }}</q-item-label>
      <q-item-label class="text-center">{{ copyright }}</q-item-label>
    </q-page-sticky>
  </q-page>
</template>

<script setup lang="ts">
  import { throttle } from "quasar";
  import { useUserStore } from "@/stores/user";
  import { URL, LOGGED_ON_USER_MENU, DEFAULT_MENU, MENU } from "@/constants";
  import { useInstallPrompt } from "@/composable/use-install-prompt";
  import { Platform } from "quasar";

  // Custom Components
  import LoginSignup from "./section/login-signup.vue";
  import { Content } from "@/interfaces/models/entities/content";

  const $q = useQuasar();
  const { t } = useI18n({ useScope: "global" });
  const { isInStandaloneMode, promptInstall, shouldShowInstallButton, showPlatformGuidance } =
    useInstallPrompt();
  const { eventBus } = useUtilities();
  const userStore = useUserStore();
  const error = ref<string | null>(null);
  const i18nKey = "more";

  const appVersion = computed(() => t(`${i18nKey}.footer.version`, { version: __APP_VERSION__ }));
  const copyright = computed(() =>
    t(`${i18nKey}.footer.copyright`, { currentYear: new Date().getFullYear() })
  );

  const trHistory = ref();
  const trRecent = ref();
  const memberConfig = ref<Content>();
  const throttledHandleContentDialog = throttle(showDialog, 2000);
  const throttledHandleLoginDialog = throttle(showLoginDialog, 2000);

  const menuItems = computed(() => {
    return userStore.isUserLogon() ? LOGGED_ON_USER_MENU : DEFAULT_MENU;
  });

  initTransactionData();

  onMounted(() => {
    eventBus.on("refresh-transaction-data", () => {
      initTransactionData();
    });

    shouldShowInstallButton();
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

  function installApp() {
    if (!isInStandaloneMode()) {
      switch (true) {
        case Platform.is.ios:
        case Platform.is.firefox:
        case Platform.is.opera:
        case Platform.is.edge:
          showPlatformGuidance();
          break;
        case Platform.is.chrome:
          promptInstall();
          break;
        default:
        //   // To be impemented: Handle unknown browsers with a generic message or action
      }
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
