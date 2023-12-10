<template>
  <q-page>
    <app-page-title :title="$t('more.title')"></app-page-title>

    <q-card-section>
      <q-item
        v-for="item in menuItems"
        :key="item.resKey"
        clickable
        @click="showContentDialog(item)"
        class="shadow-1 q-mb-md q-pl-sm"
      >
        <q-item-section avatar>
          <q-img size="36px" ratio="1" :src="item.icon" />
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
  import { ref, onMounted, watch, defineAsyncComponent } from "vue";
  // import { LocalStorage } from "quasar";

  // 3rd Party Import
  import { useI18n } from "vue-i18n";
  import { useQuasar } from "quasar";
  import axios, { AxiosError } from "axios";

  // import { STORAGE_KEYS } from "@/constants";
  import { Content } from "@/interfaces/content";

  const $q = useQuasar();

  const { locale } = useI18n({ useScope: "global" });
  const content = ref();
  // const locationPermission = ref(false);
  // const IsLogOn = ref<any>(LocalStorage.getItem(STORAGE_KEYS.FAVOURITES) || false);

  const loadContent = async (resKey: string) => {
    try {
      const url = `/Content/ContentByName/${resKey}`;
      const response = await axios.get<Content>(url);
      content.value = response.data.contentData;
      return content.value;
    } catch (err) {
      if (err instanceof AxiosError) {
        if (err.response && err.response.status === 404) {
          // Handle 404 error
          console.error("Content not found");
        } else {
          // Handle other errors
          console.error("An error occurred while fetching content");
        }
      } else {
        // Handle unexpected errors
        console.error("An unexpected error occurred");
      }
      return null; // Return null or handle error based on your requirement
    }
  };

  const menuItems = [
    { icon: "ic_language_setting.svg", title: "more.language", resKey: "language" },
    { icon: "ic_inbox.svg", title: "more.aboutUs", resKey: "about_us" },
    { icon: "ic_terms_conditions.svg", title: "more.termsConditions", resKey: "tnc" },
    { icon: "ic_privacy.svg", title: "more.privacyPolicy", resKey: "privacy_policy" }
  ];

  function onLanguageChange() {
    // emit("update-language", locale.value);
  }

  function showContentDialog(item: any) {
    switch (item.ResKey) {
      case "about_us":
        $q.dialog({
          component: defineAsyncComponent(() => import("./content/index.vue")),
          componentProps: {
            contentNameValue: "About"
          }
        });
        break;
      case "tnc":
        $q.dialog({
          component: defineAsyncComponent(() => import("./content/index.vue")),
          componentProps: {
            contentNameValue: "Terms"
          }
        });

        break;
      case "privacy_policy":
        $q.dialog({
          component: defineAsyncComponent(() => import("./content/index.vue")),
          componentProps: {
            contentNameValue: "Privacy"
          }
        });

        break;
      case "login":
        showLoginDialog();
        break;
      default:
        break;
    }
  }

  function showLoginDialog() {
    $q.dialog({
      component: defineAsyncComponent(() => import("@/views/auth/login-dialog.vue"))
    });
  }

  onMounted(() => {
    loadContent("");
  });

  watch(locale, (value: any) => {
    localStorage.setItem("locale", value);
  });
</script>
