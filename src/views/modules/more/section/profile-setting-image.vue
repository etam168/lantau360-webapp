<template>
  <q-card-section horizontal class="q-ma-lg col-12">
    <div class="col-3"></div>
    <q-card-section class="text-center col-6 item-center" style="border-radius: 10px">
      <q-btn round padding="1px" color="black">
        <q-avatar size="108px">
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

          <q-badge class="absolute-bottom-left" color="transparent">
            <app-button round color="black" icon="photo_camera" size="xs" @click="onImageUpload" />
          </q-badge>
        </q-avatar>

        <q-file
          ref="imageRef"
          accept="image/png, image/jpeg"
          v-show="false"
          v-model="imagePath"
          @update:model-value="uploadImage"
        >
        </q-file>
      </q-btn>

      <div class="text-subtitle1 text-weight-medium">
        {{ userStore.email }}
      </div>
    </q-card-section>
  </q-card-section>
</template>

<script setup lang="ts">
  // .ts files
  import { BLOB_URL, IMAGES } from "@/constants";
  import { useUserStore } from "@/stores/user";
  import { useMoreInput } from "../use-more-input";

  const userStore = useUserStore();
  const { handleUpdateMemberAvatar } = useMoreInput();

  const imageRef = ref();
  const imagePath = ref(null);

  function onImageUpload() {
    imageRef.value.pickFiles();
  }

  function uploadImage() {
    handleUpdateMemberAvatar(imagePath.value);
  }

  const avatar = computed(() => {
    return userStore.profilePic ? `${BLOB_URL}/${userStore.profilePic}` : IMAGES.PLACEHOLDER_AVATAR;
  });
</script>
