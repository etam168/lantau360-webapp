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

    <q-space />

    <q-chip clickable @click="logout()" outline color="primary" text-color="white">
      {{ $t(`${i18nKey}.button.logout`) }}
    </q-chip>
  </q-card-actions>
</template>

<script setup lang="ts">
  import { computed } from "vue";
  import { LocalStorage } from "quasar";
  import { useUserStore } from "@/stores/user";
  import { BLOB_URL, IMAGES, STORAGE_KEYS } from "@/constants";

  const userStore = useUserStore();
  const i18nKey = "auth";

  const avatar = computed(() => {
    if (userStore.profilePic != null) {
      return userStore.profilePic.includes("http")
        ? userStore.profilePic
        : `${BLOB_URL}/${userStore.profilePic}`;
    }
    return userStore.profilePic ? `${BLOB_URL}/${userStore.profilePic}` : IMAGES.PLACEHOLDER_AVATAR;
  });

  const logout = () => {
    userStore.LogOut();
    LocalStorage.set(STORAGE_KEYS.IsLogOn, false);
  };
</script>
