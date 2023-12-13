<template>
  <q-page>
    <app-page-title :title="$t('more.title')"></app-page-title>
    <q-card-section class="q-pb-none">
      <q-item class="shadow-1 q-mb-md q-pl-sm">
        <q-item-section top avatar>
          <q-btn outline round color="black" class="q-mx-auto">
            <q-avatar size="76px">
              <q-img :src="computePath">
                <template v-slot:error>
                  <q-img :src="PLACEHOLDER_AVATAR" />
                </template>

                <template v-slot:loading>
                  <div class="absolute-full flex flex-center bg-gray text-white">
                    <q-inner-loading showing class="spinner-card row justify-center items-center">
                      <q-spinner size="50px" color="primary" />
                    </q-inner-loading>
                  </div>
                </template>
              </q-img>

              <q-badge class="absolute-bottom-left" color="transparent" v-if="userStore.token">
                <app-button
                  round
                  color="black"
                  icon="photo_camera"
                  size="xs"
                  @click="onImageUpload"
                />
              </q-badge>
            </q-avatar>

            <q-file
              ref="imageRef"
              v-show="false"
              v-model="imagePath"
              @update:model-value="uploadImage"
            >
            </q-file>
          </q-btn>
        </q-item-section>

        <q-item-section>
          <q-item-label v-if="userStore.token">{{ userStore.user }}</q-item-label>
          <q-item-label caption v-if="userStore.token"> {{ $t("more.loginName") }} </q-item-label>
        </q-item-section>

        <q-item-section side>
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
              v-if="!userStore.token"
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
          <language-select @on-language="onLanguageChange" />
        </q-item-section>
      </q-item>
    </q-card-section>
  </q-page>
</template>

<script setup lang="ts">
  import { useQuasar } from "quasar";
  import { BLOB_URL, ContentOption, PLACEHOLDER_AVATAR } from "@/constants";
  import { useUserStore } from "@/stores/user";
  import { LocalStorage } from "quasar";
  import { STORAGE_KEYS } from "@/constants";
  import AppButton from "@/components/widgets/app-button.vue";
  import { useContentInput } from "./content/use-content-input";

  const { handleUpdateMemberAvatar } = useContentInput();
  const userStore = useUserStore();

  const $q = useQuasar();

  const imageRef = ref();
  const imagePath = ref(null);

  function onImageUpload() {
    imageRef.value.pickFiles();
  }

  function uploadImage() {
    handleUpdateMemberAvatar(imagePath.value);
  }

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

    if (contentKey) {
      $q.dialog({
        component: defineAsyncComponent(() => import("./content/index.vue")),
        componentProps: {
          contentNameValue: contentKey
        }
      });
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

  const computePath = computed(() => {
    return userStore.avatar ? `${BLOB_URL}/${userStore.avatar}` : PLACEHOLDER_AVATAR;
  });
</script>
