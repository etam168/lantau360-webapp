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
  import { useDialogPluginComponent, useQuasar } from "quasar";

  // Custom Components
  import AppInputPassword from "@/components/widgets/app-input-password.vue";
  import { useMemberInput } from "../shared/use-member-input";
  const { updatePassword } = useMemberInput();

  const new_password = ref("");
  const loading = ref(false);

  const $q = useQuasar();
  const props = defineProps({
    username: {
      type: String
    }
  });

  const schema = {
    new_password: "required|min:3|max:100",
    confirm_password: "passwords_mismatch:@new_password"
  };

  const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } = useDialogPluginComponent();

  async function onOKClick(values: any) {
    loading.value = true;
    try {
      await updatePassword(props.username!, values.new_password);
      onDialogOK();
    } catch (e: any) {
      $q.notify({
        message: e.message,
        type: "negative"
      });
      loading.value = false;
    }
  }
</script>
