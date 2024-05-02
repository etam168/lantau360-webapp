<template>
  <q-dialog
    ref="dialogRef"
    transition-show="slide-up"
    transition-hide="slide-down"
    :model-value="isDialogVisible"
    maximized
  >
    <q-layout view="lHh lpr lFf" class="bg-white" style="max-width: 1024px">
      <q-header class="bg-transparent text-dark">
        <app-dialog-title />
      </q-header>

      <q-page-container>
        <q-page>
          <q-card
            flat
            class="row justify-center items-center"
            style="min-height: calc(100vh - 50px)"
          >
            <q-card-section :style="$q.screen.gt.xs ? 'width: 300px' : 'width : 100%'">
              <q-img :src="checkinImage" />
              <q-item-label
                style="font-weight: 600"
                class="text-caption text-grey-8 text-center q-mt-sm"
              >
                {{ $t("community.loginDialog.subtitle") }}
              </q-item-label>
              <q-card-actions class="q-px-none no-wrap">
                <!-- <div class="row"> -->
                <app-button
                  class="full-width q-mx-xs"
                  label="Cancel"
                  color="red"
                  type="submit"
                  @click="handleCancel"
                />
                <div class="q-mx-xs"></div>

                <app-button
                  class="full-width"
                  :label="$t('auth.login.button')"
                  color="primary"
                  type="submit"
                  @click="showLoginDialog"
                />

                <!-- </div> -->
              </q-card-actions>
            </q-card-section>
          </q-card>
        </q-page>
      </q-page-container>
    </q-layout>
  </q-dialog>
</template>
<script setup lang="ts">
  import { useQuasar } from "quasar";

  const $q = useQuasar();
  const emits = defineEmits(["callback", "on-cancel"]);
  const { dialogRef, onDialogCancel } = useDialogPluginComponent();
  const isDialogVisible = ref();

  const checkinImage = ref("/img/icons/checkin.jpg");
  const { eventBus } = useUtilities();

  function showLoginDialog() {
    $q.dialog({
      component: defineAsyncComponent(() => import("@/views/auth/login-dialog.vue")),
      componentProps: {
        callback: () => {
          emits("callback");
        }
      }
    });
  }

  onMounted(() => {
    eventBus.on("on-login-success", () => {
      onDialogCancel();
    });
  });

  function handleCancel() {
    onDialogCancel();
  }
</script>
