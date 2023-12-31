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
              <q-card flat>
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

                <q-card-section>
                  <vee-input
                    v-model="memberInput.email"
                    :label="$t('auth.register.email')"
                    :value="memberInput.email"
                    icon="mdi-account"
                    name="email"
                    disable
                    placeholder="user@example.com"
                  />

                  <vee-input
                    v-model="memberInput.firstName"
                    :label="$t('auth.register.firstName')"
                    :value="memberInput.firstName"
                    icon="mdi-account"
                    name="firstName"
                    placeholder="First Name"
                  />
                  <vee-input
                    v-model="memberInput.lastName"
                    :label="$t('auth.register.lastName')"
                    :value="memberInput.lastName"
                    icon="mdi-account"
                    name="lastName"
                    placeholder="Last Name"
                  />

                  <vee-input
                    v-model="memberInput.phone"
                    :label="$t('auth.register.phone')"
                    :value="memberInput.phone"
                    icon="mdi-account"
                    name="phone"
                    placeholder="Phone"
                  />

                  <app-button
                    :label="$t('more.profileSetting.save')"
                    class="full-width"
                    color="primary"
                    type="submit"
                    size="lg"
                    @click="updateProfile"
                  />
                </q-card-section>
              </q-card>
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
  import { BLOB_URL, PLACEHOLDER_AVATAR } from "@/constants";

  import { useUserStore } from "@/stores/user";
  import { useMoreInput } from "../use-more-input";

  const { eventBus } = useUtilities();

  const { handleUpdateMemberAvatar } = useContentInput();

  const userStore = useUserStore();

  const { updateMember, getMember, memberInput } = useMoreInput();

  const imageRef = ref();
  const imagePath = ref(null);

  const { onDialogCancel, dialogRef, onDialogHide } = useDialogPluginComponent();
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

    getMember();
  });

  function updateProfile() {
    updateMember(onDialogCancel);
  }

  function updateDialogState(status: any) {
    isDialogVisible.value = status;
    eventBus.emit("DialogStatus", status, "ProfileSettingDialog");
  }
</script>
