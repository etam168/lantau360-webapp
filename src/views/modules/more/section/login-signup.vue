<template>
  <q-card-section class="q-pb-none">
    <q-item class="q-mb-md q-pl-sm">
      <q-item-section top avatar :style="!userStore.token ? 'height: 72px;' : ''">
        <q-btn round padding="1px" color="black" style="cursor: auto" v-if="userStore.token">
          <q-avatar size="72px" font-size="36px">
            <q-img :src="avatar"> </q-img>
          </q-avatar>
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
</template>

<script setup lang="ts">
  import { LocalStorage } from "quasar";

  // .ts file
  import { BLOB_URL, PLACEHOLDER_AVATAR, STORAGE_KEYS } from "@/constants";
  import { useUserStore } from "@/stores/user";

  const userStore = useUserStore();

  const emit = defineEmits(["on-dialog"]);

  const avatar = computed(() => {
    if (userStore.avatar != null) {
      return userStore.avatar.includes("http")
        ? userStore.avatar
        : `${BLOB_URL}/${userStore.avatar}`;
    }
    return userStore.avatar ? `${BLOB_URL}/${userStore.avatar}` : PLACEHOLDER_AVATAR;
  });

  const logout = () => {
    userStore.LogOut();
    LocalStorage.set(STORAGE_KEYS.IsLogOn, false);
  };

  const showLoginDialog = (mode: string) => {
    emit("on-dialog", mode);
  };
</script>
