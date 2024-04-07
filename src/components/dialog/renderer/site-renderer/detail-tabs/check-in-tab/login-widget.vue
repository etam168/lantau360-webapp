<template>
  <q-card flat class="row justify-center">
    <q-card-section :style="$q.screen.gt.xs ? 'width: 400px' : 'width : 100%'">
      <q-img :src="checkinImage" />

      <app-button
        :label="$t('auth.login.button')"
        class="full-width q-mt-md"
        color="primary"
        type="submit"
        size="md"
        @click="showLoginDialog"
      />
      <div class="text-caption text-weight-regular text-grey-6 text-center q-mt-sm">
        {{ $t("auth.login.checkInCaption") }}
      </div>
    </q-card-section>
  </q-card>
</template>
<script setup lang="ts">
  import { useQuasar } from "quasar";

  const $q = useQuasar();
  const emits = defineEmits(["callback"]);

  const checkinImage = ref("/img/icons/checkin.jpg");

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
</script>
