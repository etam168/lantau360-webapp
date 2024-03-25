<template>
  <q-dialog
    ref="dialogRef"
    transition-show="slide-up"
    transition-hide="slide-down"
    @update:model-value="updateDialogState"
    :model-value="isDialogVisible"
  >
    <q-card>
      <q-card-section class="row items-center">
        <q-avatar icon="info" />
        <span class="q-ml-sm">{{
          $t("more.profileSetting.claimFreePointText", { points: "20" })
        }}</span>
      </q-card-section>

      <q-card-actions align="right">
        <q-btn flat :label="$t('action.no')" color="primary" v-close-popup />
        <q-btn flat :label="$t('action.yes')" color="primary" @click="handleOk" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
  import { useDialogPluginComponent } from "quasar";
  import { useUtilities } from "@/composable/use-utilities";

  const { eventBus } = useUtilities();
  const { dialogRef, onDialogCancel } = useDialogPluginComponent();
  const isDialogVisible = ref();

  const props = defineProps({
    callback: {
      type: Function,
      required: true
    }
  });
  onMounted(() => {
    eventBus.on("ConfirmationDialog", () => {
      isDialogVisible.value = false;
    });
  });

  function updateDialogState(status: any) {
    isDialogVisible.value = status;
    eventBus.emit("DialogStatus", status, "ConfirmationDialog");
  }

  function handleOk() {
    props.callback(onDialogCancel());
  }
</script>
