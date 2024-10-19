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
      {{ $t("auth.login.logout") }}
    </q-chip>
  </q-card-actions>
  <!-- <q-item class="bg-red">
    <q-item-section avatar style="height: 72px">
      <q-btn round padding="1px" color="black" style="cursor: auto">
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
      </q-btn>
    </q-item-section>

    <q-item-section>
      <q-item-label lines="1">{{ userStore.user }}</q-item-label>
    </q-item-section>

    <q-item-section side>
      <div class="text-grey-8 q-gutter-xs">
        <q-chip clickable @click="logout()" outline color="primary" text-color="white">
          {{ $t("auth.login.logout") }}
        </q-chip>
      </div>
    </q-item-section>
  </q-item> -->
</template>

<script setup lang="ts">
  import { computed } from "vue";
  import { LocalStorage } from "quasar";
  import { useUserStore } from "@/stores/user";
  import { BLOB_URL, IMAGES, STORAGE_KEYS } from "@/constants";

  const userStore = useUserStore();

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
