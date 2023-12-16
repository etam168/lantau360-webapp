<template>
  <q-page>
    <app-page-title :title="$t('more.title')"></app-page-title>

    <login-signup @on-dialog="showLoginDialog" />

    <q-card-section class="q-pt-none">
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
          <language-select />
        </q-item-section>
      </q-item>
    </q-card-section>
  </q-page>
</template>

<script setup lang="ts">
  import { useQuasar } from "quasar";
  import { Content } from "@/interfaces/models/entities/content";
  import { ContentOption } from "@/constants";
  import LoginSignup from "./section/login-signup.vue";

  const $q = useQuasar();

  const data = ref<Content | null>(null);
  //const error = ref<string | null>(null);

  const menuItems = [
    { icon: "ic_language_setting.svg", title: "more.language", resKey: "language" },
    { icon: "ic_inbox.svg", title: "more.aboutUs", resKey: ContentOption.ABOUT },
    { icon: "ic_terms_conditions.svg", title: "more.termsConditions", resKey: ContentOption.TERMS },
    { icon: "ic_privacy.svg", title: "more.privacyPolicy", resKey: ContentOption.PRIVACY }
  ];

  async function showContentDialog(item: any) {
    let contentKey;

    switch (item.resKey) {
      case ContentOption.ABOUT:
        contentKey = "About";
        break;
      case ContentOption.PRIVACY:
        contentKey = "Privacy";
        break;
      case ContentOption.TERMS:
        contentKey = "Terms";
        break;
      case "login":
        showLoginDialog("login");
        return; // Exit the function for the "login" case
      default:
        return; // Exit the function for unknown cases
    }
    try {
      const url = `/Content/ContentByName/${contentKey}`;
      const response = await axios.get<Content>(url);

      data.value = response.data;
      if (response.status === 200) {
        $q.dialog({
          component: defineAsyncComponent(() => import("./section/content-dialog.vue")),
          componentProps: {
            contentDataValue: data.value
          }
        });
      }
    } catch (error) {
      // Handle error if the API call fails
      console.error("Error fetching data: ", error);
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
</script>
