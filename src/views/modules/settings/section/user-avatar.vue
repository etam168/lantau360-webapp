<template>
  <q-card-actions>
    <q-btn outline round color="black" class="q-ma-xl">
      <q-avatar size="128px">
        <q-img :src="imageLink">
          <template v-slot:error>
            <q-img :src="PLACEHOLDER_AVATAR" />
          </template>

          <template v-slot:loading>
            <div class="absolute-full flex flex-center bg-gray text-white">
              <q-inner-loading showing class="spinner-card row justify-center items-center">
                <q-spinner size="50px" color="primary" />
              </q-inner-loading>
            </div> </template
        ></q-img>

        <q-badge class="absolute-bottom-left" color="transparent">
          <app-button round color="black" icon="photo_camera" size="sm" @click="onImageUpload" />
        </q-badge>
      </q-avatar>

      <q-file ref="imageRef" v-show="false" v-model="imagePath" @update:model-value="uploadImage">
      </q-file>
    </q-btn>
    <div class="text-subtitle1 text-weight-medium">{{ $t("settings.profile.subtitle") }}</div>
  </q-card-actions>
</template>

<script setup lang="ts">
  // Vue Import
  import { ref, computed } from "vue";
  import { BLOB_URL, PLACEHOLDER_AVATAR } from "@/constants";
  import { useUserStore } from "@/stores/user";

  import AppButton from "@/components/widgets/app-button.vue";

  const userStore = useUserStore();
  const imagePath = ref(null);

  const imageLink = computed(() => {
    return userStore.avatar ? `${BLOB_URL}/${userStore.avatar}` : PLACEHOLDER_AVATAR;
  });

  const imageRef = ref();

  function onImageUpload() {
    imageRef.value.pickFiles();
  }

  function uploadImage() {
    emit("update-avatar", imagePath.value);
  }

  const emit = defineEmits(["update-avatar"]);
</script>
