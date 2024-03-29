<template>
  <q-page>
    <app-page-title :title="$t('more.title')"></app-page-title>

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
            {{ $t(item.title) }}</q-item-label
          >
        </q-item-section>

        <q-item-section side v-if="item.name == MENU.LANGUAGE">
          <language-select />
        </q-item-section>
        <q-item-section side v-else>
          <q-btn
            dense
            flat
            round
            icon="arrow_forward"
            v-close-popup
            @click="throttledHandleContentDialog(item)"
          ></q-btn>
        </q-item-section>
      </q-item>
    </q-card-section>

    <q-page-sticky position="bottom" :offset="[0, 18]">
      <q-item-label class="text-center">{{ appVersion }}</q-item-label>
      <q-item-label class="text-center">{{ copyright }}</q-item-label>
    </q-page-sticky>
  </q-page>
</template>

<script setup lang="ts">
  import { throttle } from "quasar";
  import { useUserStore } from "@/stores/user";
  import { URL, LOGGED_ON_USER_MENU, DEFAULT_MENU, MENU } from "@/constants";

  // Custom Components
  import LoginSignup from "./section/login-signup.vue";

  const $q = useQuasar();
  const { t } = useI18n({ useScope: "global" });
  const userStore = useUserStore();
  const error = ref<string | null>(null);

  const appVersion = computed(() => t("more.footer.version", { version: __APP_VERSION__ }));
  const copyright = computed(() =>
    t("more.footer.copyright", { currentYear: new Date().getFullYear() })
  );

  const trRecent = ref();
  const trHistory = ref();

  const menuItems = computed(() => {
    return userStore.isUserLogon() ? LOGGED_ON_USER_MENU : DEFAULT_MENU;
  });

  const throttledHandleLoginDialog = throttle(showLoginDialog, 2000);
  const throttledHandleContentDialog = throttle(showDialog, 2000);
  initTransactionData();

  async function showDialog(item: any) {
    if (item.contentKey) {
      OpenDialog(
        import("./section/content-dialog.vue"),
        { title: t(item.title) },
        item.contentKey,
        true
      );
    } else if (item.name == MENU.PROFILE) {
      OpenDialog(import("./section/profile-setting-dialog.vue"));
    } else if (item.name == MENU.ACCOUNT) {
      if (trHistory.value && trRecent.value) {
        OpenDialog(import("./section/profile-account-dialog.vue"), {
          trHistory: trHistory.value,
          trRecent: trRecent.value
        });
      }
    }
  }

  function showLoginDialog(tabValue: string) {
    $q.dialog({
      component: defineAsyncComponent(() => import("@/views/auth/login-dialog.vue")),
      componentProps: {
        tabValue: tabValue,
        refresAccountData: initTransactionData
      }
    });
  }

  async function OpenDialog(
    component: any,
    componentProps?: any,
    contentKey?: string,
    isContent: boolean = false
  ) {
    const requestUrl = isContent
      ? `${URL.CONTENT_NAME_URL}/${contentKey}`
      : `${URL.MEMBER_URL}/${userStore.userId}`;

    axios
      .get(requestUrl)
      .then(response => {
        $q.dialog({
          component: defineAsyncComponent(() => component),
          componentProps: {
            data: response.data,
            ...componentProps
          }
        });
      })
      .catch(err => {
        handleError(err);
      });
  }

  async function initTransactionData() {
    try {
      if (userStore.isUserLogon()) {
        const [transactionHistory, recentTransactions] = await Promise.all([
          axios.get(`${URL.MEMBER_TRANSACTIONS_URL}/${userStore.userId}`),
          axios.get(`${URL.MEMBER_RECENT_RANSACTIONS_URL}/${userStore.userId}`)
        ]);

        trRecent.value = recentTransactions.data;
        trHistory.value = transactionHistory.data;

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
