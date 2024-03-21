<template>
  <q-card-section horizontal class="q-ma-lg col-12">
    <div class="col-3"></div>
    <q-card-section class="text-center col-6 item-center" style="border-radius: 10px">
      <q-btn round padding="1px" color="black">
        <q-avatar size="108px">
          <q-img :ratio="1" :src="avatar">
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

          <q-badge class="absolute-bottom-left" color="transparent">
            <app-button round color="black" icon="photo_camera" size="xs" @click="onImageUpload" />
          </q-badge>
        </q-avatar>

        <q-file ref="imageRef" v-show="false" v-model="imagePath" @update:model-value="uploadImage">
        </q-file>
      </q-btn>

      <div class="text-subtitle1 text-weight-medium">
        {{ userStore.email }}
      </div>
    </q-card-section>
  </q-card-section>
</template>

<script setup lang="ts">
  // Interface files

  // .ts files
  import { BLOB_URL, PLACEHOLDER_AVATAR } from "@/constants";
  import { useUserStore } from "@/stores/user";
  import { useMemberInput } from "../use-member-input";

  const userStore = useUserStore();
  const { handleUpdateMemberAvatar } = useMemberInput();

  const imageRef = ref();
  const imagePath = ref(null);

  function onImageUpload() {
    imageRef.value.pickFiles();
  }

  function uploadImage() {
    handleUpdateMemberAvatar(imagePath.value);
  }

  const avatar = computed(() => {
    return userStore.profilePic ? `${BLOB_URL}/${userStore.profilePic}` : PLACEHOLDER_AVATAR;
  });
</script>
../use-more-input