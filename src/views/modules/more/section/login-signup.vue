<template>
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
</template>

<script setup lang="ts">
  import { LocalStorage } from "quasar";

  import { useUserStore } from "@/stores/user";
  import { BLOB_URL, PLACEHOLDER_AVATAR, STORAGE_KEYS } from "@/constants";
  const userStore = useUserStore();

  const { handleUpdateMemberAvatar } = useContentInput();

  const emit = defineEmits(["on-dialog"]);

  const imageRef = ref();
  const imagePath = ref(null);

  function onImageUpload() {
    imageRef.value.pickFiles();
  }

  function uploadImage() {
    handleUpdateMemberAvatar(imagePath.value);
  }

  const computePath = computed(() => {
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
