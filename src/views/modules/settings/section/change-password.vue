<template>
  <q-card-section style="max-width: 720px">
    <q-list>
      <q-item-label class="text-weight-bold text-subtitle1 text-black" header>{{
        $t("settings.security.headline")
      }}</q-item-label>

      <q-item>
        <q-item-section>
          <q-item-label>{{ $t("settings.security.password") }}</q-item-label>
        </q-item-section>

        <q-item-section side>
          <q-btn
            :label="$t('settings.security.passwordChange')"
            color="primary"
            padding="none"
            flat
            @click="changePassword()"
          />
        </q-item-section>
      </q-item>
    </q-list>
  </q-card-section>
</template>

<script setup lang="ts">
  // 3rd Party Import
  import { useQuasar } from "quasar";

  // Custom Components
  import PasswordChangeDialog from "./password-change-dialog.vue";

  const $q = useQuasar();

  function changePassword() {
    $q.dialog({
      component: PasswordChangeDialog,
      componentProps: {
        text: "something"
      }
    });
  }
</script>
