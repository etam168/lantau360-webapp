<template>
  <!-- notice dialogRef here -->
  <q-dialog ref="dialogRef" @hide="onDialogHide">
    <q-card class="q-dialog-plugin">
      <q-card-section class="bg-primary text-white">
        <div class="text-h6">{{ $t("settings.password.title") }}</div>
      </q-card-section>

      <q-card-section class="q-pa-lg">
        <vee-form :validation-schema="schema" @submit="onOKClick" v-slot="{ meta }">
          <app-input-password
            class="q-mt-lg"
            name="old_password"
            :label="$t('settings.password.old')"
            :value="old_password"
          />

          <app-input-password
            name="new_password"
            :label="$t('settings.password.new')"
            :value="new_password"
          />

          <app-input-password
            name="confirm_password"
            :label="$t('settings.password.confirm')"
            :value="new_password"
          />

          <q-card-actions align="right">
            <q-btn flat color="primary" label="Cancel" @click="onDialogCancel" />
            <q-btn
              color="primary"
              label="Save"
              type="submit"
              :disabled="!(meta.valid && meta.dirty) || loading"
            />
          </q-card-actions>
        </vee-form>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
  // Vue Import
  import { ref } from "vue";

  // 3rd Party Import
  import { useDialogPluginComponent } from "quasar";
  import AppInputPassword from "@/components/widgets/app-input-password.vue";

  // .ts files
  import { useUserData } from "../use-user-data";
  const { updatePassword } = useUserData();

  const old_password = ref("");
  const new_password = ref("");
  const loading = ref(false);

  const schema = {
    old_password: "required|min:3|max:100",
    new_password: "required|min:3|max:100",
    confirm_password: "passwords_mismatch:@new_password"
  };

  const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } = useDialogPluginComponent();

  async function onOKClick(values: any) {
    loading.value = false;

    const status = await updatePassword(values.new_password, values.old_password);
    if (status) onDialogOK();
  }
</script>
