<template>
  <q-page>
    <app-page-title :title="$t('more.title')"></app-page-title>
    <q-card-section>
      <q-item>
        <div>{{ userStore.avatar }}</div>
        <q-item-section avatar v-if="userStore.token">
          <q-avatar>
            <img :src="computePath(userStore.avatar)" />
          </q-avatar>
        </q-item-section>
        <q-item-section>
          <q-item-label>{{ userStore.user }}</q-item-label>
        </q-item-section>

        <q-item-section side top>
          <div class="text-grey-8 q-gutter-xs">
            <q-chip
              v-if="userStore.token"
              clickable
              @click="logout()"
              outline
              color="primary"
              text-color="white"
            >
              {{ $t("auth.login.logout") }}
            </q-chip>
            <q-chip
              v-if="!userStore.token"
              clickable
              @click="showLoginDialog('login')"
              outline
              color="primary"
              text-color="white"
            >
              {{ $t("auth.login.button") }}
            </q-chip>
            <q-chip
              clickable
              @click="showLoginDialog('register')"
              color="primary"
              text-color="white"
            >
              {{ $t("auth.register.joinNow") }}
            </q-chip>
          </div>
        </q-item-section>
      </q-item>
    </q-card-section>

    <q-card-section>
      <q-item
        v-for="item in menuItems"
        :key="item.resKey"
        clickable
        @click="showContentDialog(item)"
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

        <q-item-section side v-if="item.resKey == 'language'">
          <language-select @on-language="onLanguageChange" />
        </q-item-section>
      </q-item>
    </q-card-section>
  </q-page>
</template>

<script setup lang="ts">
  import { defineAsyncComponent } from "vue";
  // import { LocalStorage } from "quasar";

  // 3rd Party Import
  // import { useI18n } from "vue-i18n";
  import { useQuasar } from "quasar";
  // import { STORAGE_KEYS } from "@/constants";
  import { BLOB_URL, ContentOption, PLACEHOLDER_AVATAR } from "@/constants";
  import { useUserStore } from "@/stores/user";
  import { LocalStorage } from "quasar";
  import { STORAGE_KEYS } from "@/constants";
  const userStore = useUserStore();

  //Custom Components

  const $q = useQuasar();
  // const { locale } = useI18n({ useScope: "global" });
  // const locationPermission = ref(false);
  // const IsLogOn = ref<any>(LocalStorage.getItem(STORAGE_KEYS.FAVOURITES) || false);

  const menuItems = [
    { icon: "ic_language_setting.svg", title: "more.language", resKey: "language" },
    { icon: "ic_inbox.svg", title: "more.aboutUs", resKey: ContentOption.ABOUT },
    { icon: "ic_terms_conditions.svg", title: "more.termsConditions", resKey: ContentOption.TERMS },
    { icon: "ic_privacy.svg", title: "more.privacyPolicy", resKey: ContentOption.PRIVACY }
  ];

  function onLanguageChange() {
    // emit("update-language", locale.value);
  }

  function showContentDialog(item: any) {
    switch (item.ResKey) {
      case ContentOption.ABOUT:
      case ContentOption.PRIVACY:
      case ContentOption.TERMS:
        $q.dialog({
          component: defineAsyncComponent(() => import("./content/index.vue")),
          componentProps: {
            contentNameValue: item.resKey
          }
        });

        break;
      case "login":
        showLoginDialog("login");
        break;
      default:
        break;
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

  const logout = () => {
    userStore.LogOut();
    LocalStorage.set(STORAGE_KEYS.IsLogOn, false);
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const computePath = (path: string) => {
    return path ? `${BLOB_URL}/${path}` : PLACEHOLDER_AVATAR;
  };

  // watch(locale, (value: any) => {
  //   localStorage.setItem("locale", value);
  // });
</script>
