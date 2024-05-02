<template>
  <q-card flat class="row justify-center items-center" style="min-height: calc(100vh - 50px)">
    <q-card-section :style="$q.screen.gt.xs ? 'width: 300px' : 'width : 100%'">
      <q-img :src="checkinImage" />
      <q-item-label style="font-weight: 600" class="text-caption text-grey-8 text-center q-mt-sm">
        {{ $t("auth.login.checkInCaption") }}
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
</template>
<script setup lang="ts">
  import { useQuasar } from "quasar";

  const $q = useQuasar();
  const emits = defineEmits(["on-cancel"]);

  const checkinImage = ref("/img/icons/checkin.jpg");

  function showLoginDialog() {
    $q.dialog({
      component: defineAsyncComponent(() => import("@/views/auth/login-dialog.vue"))
    });
  }

  function handleCancel() {
    emits("on-cancel");
  }
</script>
