<template>
  <suspense>
    <template #default>
      <q-dialog
        ref="dialogRef"
        @hide="onDialogHide"
        transition-show="slide-up"
        transition-hide="slide-down"
        @update:model-value="updateDialogState"
        :model-value="isDialogVisible"
        maximized
      >
        <q-layout view="lHh lpr lFf" class="bg-white" style="max-width: 1024px">
          <q-header class="bg-transparent text-dark">
            <app-dialog-title>{{ $t(`more.profileSetting.title`) }}</app-dialog-title>
          </q-header>

          <q-page-container>
            <q-page>
              <q-card-actions>
                <q-btn outline round color="black" class="q-mr-xl">
                  <q-avatar size="128px">
                    <q-img :src="computePath">
                      <template v-slot:error>
                        <q-img :src="PLACEHOLDER_AVATAR" />
                      </template>

                      <template v-slot:loading>
                        <div class="absolute-full flex flex-center bg-gray text-white">
                          <q-inner-loading
                            showing
                            class="spinner-card row justify-center items-center"
                          >
                            <q-spinner size="50px" color="primary" />
                          </q-inner-loading>
                        </div>
                      </template>
                    </q-img>

                    <q-badge class="absolute-bottom-left" color="transparent">
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
                <div class="text-subtitle1 text-weight-medium">
                  {{ $t("more.profileSetting.subtitle") }}
                </div>
              </q-card-actions>
            </q-page>
          </q-page-container>
        </q-layout>
      </q-dialog>
    </template>
    <template #fallback>
      <div class="row justify-center items-center" style="height: 500px"></div>
    </template>
  </suspense>
</template>

<script setup lang="ts">
  // Other Import
  import { useDialogPluginComponent } from "quasar";
  import { BLOB_URL, PLACEHOLDER_AVATAR } from "@/constants";
  import { EventBus } from "quasar";
  import { useUserStore } from "@/stores/user";

  const { handleUpdateMemberAvatar } = useContentInput();

  const userStore = useUserStore();
  const eventBus = new EventBus();

  const imageRef = ref();
  const imagePath = ref(null);

  const { dialogRef, onDialogHide } = useDialogPluginComponent();
  const isDialogVisible = ref();

  function onImageUpload() {
    imageRef.value.pickFiles();
  }

  function uploadImage() {
    handleUpdateMemberAvatar(imagePath.value);
  }

  const computePath = computed(() => {
    return userStore.avatar ? `${BLOB_URL}/${userStore.avatar}` : PLACEHOLDER_AVATAR;
  });

  onMounted(() => {
    eventBus.on("ProfileSettingDialog", () => {
      isDialogVisible.value = false;
    });
  });

  function updateDialogState(status: any) {
    isDialogVisible.value = status;
    eventBus.emit("DialogStatus", status, "ProfileSettingDialog");
  }
</script>
