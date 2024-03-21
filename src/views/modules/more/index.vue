<template>
  <q-page>
    <app-page-title :title="$t('more.title')"></app-page-title>

    <login-signup @on-dialog="throttledHandleLoginDialog" />

    <q-card-section class="q-pt-none q-qb-xl">
      <q-item
        v-for="(item, index) in filteredMenuItems"
        :key="index"
        class="shadow-1 q-mb-md q-pl-sm"
      >
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

        <q-item-section side v-if="item.name == Menu.LANGUAGE">
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
  import ICONS from "@/constants/app/image-icon";
  import { Content } from "@/interfaces/models/entities/content";
  import { throttle } from "quasar";
  import { useUserStore } from "@/stores/user";
  import { URL } from "@/constants";

  // Custom Components
  import LoginSignup from "./section/login-signup.vue";

  const $q = useQuasar();
  const { t } = useI18n({ useScope: "global" });
  const userStore = useUserStore();

  const appVersion = computed(() => t("more.footer.version", { version: __APP_VERSION__ }));
  const copyright = computed(() =>
    t("more.footer.copyright", { currentYear: new Date().getFullYear() })
  );

  const filteredMenuItems = computed(() => {
    // Filter out the "profileSetting" item if userStore.token does not exist
    return userStore.isUserLogon()
      ? menuItems
      : menuItems.filter(item => item.name !== Menu.PROFILE && item.name !== Menu.ACCOUNT);
  });

  const Menu = {
    LANGUAGE: "language",
    PRIVACY: "privacy",
    TERMS: "terms",
    PROFILE: "profileSetting",
    ACCOUNT: "account"
  };

  const menuItems = [
    { name: Menu.LANGUAGE, icon: ICONS.SETTING, title: "more.language" },
    {
      name: Menu.TERMS,
      icon: ICONS.TNC,
      title: "more.terms",
      contentKey: "Terms"
    },
    {
      name: Menu.PRIVACY,
      icon: ICONS.PRIVACY,
      title: "more.privacy",
      contentKey: "Privacy"
    },
    { name: Menu.PROFILE, icon: ICONS.PROFILE, title: "more.profile" },
    { name: Menu.ACCOUNT, icon: ICONS.ACCOUNT, title: "more.account.title" }
  ];

  const throttledHandleLoginDialog = throttle(showLoginDialog, 2000);
  const throttledHandleContentDialog = throttle(showContentDialog, 2000);

  async function showContentDialog(item: any) {
    if (item.contentKey) {
      try {
        const url = `${URL.CONTENT_NAME_URL}/${item.contentKey}`;
        const response = await axios.get<Content>(url);
        if (response.status === 200) {
          $q.dialog({
            component: defineAsyncComponent(() => import("./section/content-dialog.vue")),
            componentProps: {
              contentDataValue: response.data,
              title: t(item.title)
            }
          });
        }
      } catch (error) {
        // Handle error if the API call fails
      }
    } else if (item.name == Menu.PROFILE) {
      OpenProfileDialog();
    } else if (item.name == Menu.ACCOUNT) {
      OpenAccountDialog();
    }
  }

  function showLoginDialog(tabValue: string) {
    $q.dialog({
      component: defineAsyncComponent(() => import("@/views/auth/login-dialog.vue")),
      componentProps: {
        tabValue: tabValue
      }
    });
  }

  function OpenProfileDialog() {
    axios
      .get(`${URL.MEMBER_URL}/${userStore.userId}`)
      .then(response => {
        $q.dialog({
          component: defineAsyncComponent(() => import("./section/profile-setting-dialog.vue")),
          componentProps: {
            member: response.data
          }
        });
      })
      .catch(errors => {
        errors;
        // notify(errors.message, "negative");
      });
  }

  function OpenAccountDialog() {
    axios
      .get(`${URL.MEMBER_URL}/${userStore.userId}`)
      .then(response => {
        $q.dialog({
          component: defineAsyncComponent(() => import("./section/profile-account-dialog.vue")),
          componentProps: {
            member: response.data
          }
        });
      })
      .catch(errors => {
        errors;
        // notify(errors.message, "negative");
      });
  }

  try {
    // Sync user points.
    userStore.fetchMemberPoints();
  } catch (err: any) {
    console.error(err.message);
  }
</script>
