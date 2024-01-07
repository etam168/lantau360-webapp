<template>
  <q-page>
    <app-page-title :title="$t('more.title')"></app-page-title>

    <login-signup @on-dialog="showLoginDialog" />

    <q-card-section class="q-pt-none">
      <q-item
        v-for="(item, index) in filteredMenuItems"
        :key="index"
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

        <q-item-section side v-if="item.name == Menu.LANGUAGE">
          <language-select />
        </q-item-section>
      </q-item>
    </q-card-section>
  </q-page>
</template>

<script setup lang="ts">
  // Interface files
  import { Content } from "@/interfaces/models/entities/content";

  // .ts files
  import { useUserStore } from "@/stores/user";

  // Custom Components
  import LoginSignup from "./section/login-signup.vue";

  const userStore = useUserStore();
  const $q = useQuasar();
  const data = ref<Content | null>(null);
  const memberData = ref();

  const Menu = {
    LANGUAGE: "language",
    ABOUT: "aboutUs",
    PRIVACY: "privacy",
    TERMS: "terms",
    PROFILE: "profileSetting"
  };

  const menuItems = [
    { name: Menu.LANGUAGE, icon: "ic_language_setting.svg", title: "more.language" },
    { name: Menu.ABOUT, icon: "ic_inbox.svg", title: "more.aboutUs", contentKey: "About" },
    { name: Menu.TERMS, icon: "ic_terms_conditions.svg", title: "more.terms", contentKey: "Terms" },
    { name: Menu.PRIVACY, icon: "ic_privacy.svg", title: "more.privacy", contentKey: "Privacy" },
    { name: Menu.PROFILE, icon: "ic_privacy.svg", title: "more.profileSetting.title" }
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
              contentDataValue: data.value
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
        // notify(errors.message, "negative");
        console.log(errors);
      });
  }
</script>
