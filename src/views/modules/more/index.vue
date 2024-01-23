<template>
  <q-page>
    <app-page-title :title="$t('more.title')"></app-page-title>

    <login-signup @on-dialog="throttledHandleLoginDialog" />

    <q-card-section class="q-pt-none">
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

    <q-card flat class="text-center justify-center absolute-bottom">
      <q-card-section class="text-center text-subtitle2 q-pa-xs q-py-md">
        <div>{{ appVersion }}</div>
        <div class="text-caption text-grey">
          {{ $t("more.footer.copyRightText", { currentYear: currentYear }) }}
        </div>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup lang="ts">
  // Interface files
  import { Content } from "@/interfaces/models/entities/content";
  import { throttle } from "quasar";

  // .ts files
  import { useUserStore } from "@/stores/user";

  // Custom Components
  import LoginSignup from "./section/login-signup.vue";

  const { t } = useI18n({ useScope: "global" });
  const userStore = useUserStore();
  const $q = useQuasar();

  const data = ref<Content | null>(null);
  const memberData = ref();
  const appVersion = __APP_VERSION__;
  const currentYear = new Date().getFullYear();
  const Menu = {
    LANGUAGE: "language",
    ABOUT: "aboutUs",
    PRIVACY: "privacy",
    TERMS: "terms",
    PROFILE: "profileSetting"
  };

  const menuItems = [
    { name: Menu.LANGUAGE, icon: "./img/icons/ic_language_setting.svg", title: "more.language" },
    {
      name: Menu.ABOUT,
      icon: "./img/icons/ic_inbox.svg",
      title: "more.aboutUs",
      contentKey: "About"
    },
    {
      name: Menu.TERMS,
      icon: "./img/icons/ic_terms_conditions.svg",
      title: "more.terms",
      contentKey: "Terms"
    },
    {
      name: Menu.PRIVACY,
      icon: "./img/icons/ic_privacy.svg",
      title: "more.privacy",
      contentKey: "Privacy"
    },
    { name: Menu.PROFILE, icon: "./img/icons/ic_privacy.svg", title: "more.profile" }
  ];

  async function showContentDialog(item: any) {
    if (item.contentKey) {
      // This will be true if contentKey is not undefined
      try {
        const url = `/Content/ContentByName/${item.contentKey}`;
        const response = await axios.get<Content>(url);

        data.value = response.data;
        if (response.status === 200) {
          $q.dialog({
            component: defineAsyncComponent(() => import("./section/content-dialog.vue")),
            componentProps: {
              contentDataValue: data.value,
              title: t(item.title)
            }
          });
        }
      } catch (error) {
        // Handle error if the API call fails
      }
    } else if (item.name == Menu.PROFILE) {
      OpenProfileDialog();
    }
  }

  const filteredMenuItems = computed(() => {
    // Filter out the "profileSetting" item if userStore.token does not exist
    return userStore.isUserLogon()
      ? menuItems
      : menuItems.filter(item => item.name !== Menu.PROFILE);
  });

  const throttledHandleLoginDialog = throttle(showLoginDialog, 2000);
  const throttledHandleContentDialog = throttle(showContentDialog, 2000);

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
      .get(`/Member/${userStore.userId}`)
      .then(response => {
        memberData.value = response.data;
        $q.dialog({
          component: defineAsyncComponent(() => import("./section/profile-setting-dialog.vue")),
          componentProps: {
            member: memberData.value
          }
        });
      })
      .catch(errors => {
        errors;
        // notify(errors.message, "negative");
      });
  }
</script>
