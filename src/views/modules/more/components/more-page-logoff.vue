<template>
  <q-card-actions>
    <q-avatar size="72px" font-size="36px">
      <q-img :ratio="1" :src="avatar">
        <template v-slot:error>
          <q-img :src="IMAGES.PLACEHOLDER_AVATAR" style="left: 0" />
        </template>
        <template v-slot:loading>
          <div class="absolute-full flex flex-center bg-gray text-white">
            <q-inner-loading showing class="spinner-card row justify-center items-center">
              <q-spinner size="50px" color="primary" />
            </q-inner-loading>
          </div>
        </template>
      </q-img>
    </q-avatar>
    <div class="q-ml-md">
      <div class="text-body1">{{ userStore.userInfo.name }}</div>
      <div class="text-caption">
        {{ userStore.userInfo.user }}
      </div>
    </div>

    <q-space />

    <q-chip clickable @click="logout()" outline color="primary" text-color="white">
      {{ $t(`${i18nKey}.mainMenu.logoff`) }}
    </q-chip>
  </q-card-actions>
</template>

<script setup lang="ts">
  import { LocalStorage } from "quasar";
  import { useUserStore } from "@/stores/user";
  import { BLOB_URL, IMAGES, STORAGE_KEYS } from "@/constants";

  const userStore = useUserStore();
  const i18nKey = "more";

  const avatar = computed(() => {
    if (userStore.userInfo.profilePic != null) {
      return userStore.userInfo.profilePic.includes("http")
        ? userStore.userInfo.profilePic
        : `${BLOB_URL}/${userStore.userInfo.profilePic}`;
    }
    return userStore.userInfo.profilePic ? `${BLOB_URL}/${userStore.userInfo.profilePic}` : IMAGES.PLACEHOLDER_AVATAR;
  });

  const logout = () => {
    userStore.LogOut();
    LocalStorage.set(STORAGE_KEYS.IsLogOn, false);
  };
</script>
