<template>
  <q-page>
    <app-page-title :title="$t('more.title')"></app-page-title>

    <q-card-section>
      <q-avatar size="96px">
        <img src="https://cdn.quasar.dev/img/avatar.png" />
      </q-avatar>
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
          <language-select />
        </q-item-section>
      </q-item>
    </q-card-section>
  </q-page>
</template>

<script setup lang="ts">
  import { defineAsyncComponent } from "vue";

  // 3rd Party Import
  import { useQuasar } from "quasar";
  // import { STORAGE_KEYS } from "@/constants";
  import { ContentOption } from "@/constants";

  const $q = useQuasar();
  // const IsLogOn = ref<any>(LocalStorage.getItem(STORAGE_KEYS.FAVOURITES) || false);

  const menuItems = [
    { icon: "ic_language_setting.svg", title: "more.language", resKey: "language" },
    { icon: "ic_inbox.svg", title: "more.aboutUs", resKey: ContentOption.ABOUT },
    { icon: "ic_terms_conditions.svg", title: "more.termsConditions", resKey: ContentOption.TERMS },
    { icon: "ic_privacy.svg", title: "more.privacyPolicy", resKey: ContentOption.PRIVACY }
  ];

  function showContentDialog(item: any) {
    switch (item.resKey) {
      case ContentOption.ABOUT:
      case ContentOption.PRIVACY:
      case ContentOption.TERMS:
        $q.dialog({
          component: defineAsyncComponent(() => import("./content/index.vue")),
          componentProps: {
            name: item.resKey
          }
        });

        break;
      default:
        break;
    }
  }
</script>
