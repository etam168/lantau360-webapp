<template>
  <q-dialog
    ref="dialogRef"
    transition-show="slide-up"
    transition-hide="slide-down"
    @update:model-value="updateDialogState"
    :model-value="isDialogVisible"
  >
    <q-card class="q-px-sm">
      <q-card-section class="row items-center q-pa-none q-mt-sm">
        <q-avatar icon="info" :text-color="haveEnoughPoints ? 'red' : 'primary'" />
        <span class="text-h6">{{ title }}</span>
      </q-card-section>

      <q-card-section class="row items-center q-pt-none">
        <span class="q-ml-lg">{{ bodyMessage }}</span>
      </q-card-section>

      <q-card-actions v-if="haveEnoughPoints" align="right">
        <q-btn flat :label="$t('action.ok')" color="primary" v-close-popup />
      </q-card-actions>
      <q-card-actions v-else align="right">
        <q-btn flat :label="$t('action.no')" color="primary" v-close-popup />
        <q-btn flat :label="$t('action.yes')" color="primary" @click="handleOk" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
  import { useDialogPluginComponent } from "quasar";
  import { useUtilities } from "@/composable/use-utilities";
  import { useUserStore } from "@/stores/user";
  import i18n from "@/plugins/i18n/i18n";

  const { eventBus } = useUtilities();
  const { dialogRef, onDialogCancel } = useDialogPluginComponent();
  const { availabelPoints, pointsPerPost } = useUserStore();
  const { t } = i18n.global;
  const isDialogVisible = ref();

  const props = defineProps({
    callback: {
      type: Function,
      required: true
    }
  });

  const title = computed(() =>
    availabelPoints >= pointsPerPost ? "Enough Points" : "Confirmation"
  );

  const bodyMessage = computed(() =>
    availabelPoints >= pointsPerPost
      ? `You have enough points to create new post.Please try again when point balance is less then ${pointsPerPost}`
      : t("more.profileSetting.claimFreePointText", { points: pointsPerPost })
  );

  const haveEnoughPoints = computed(() => availabelPoints >= pointsPerPost);

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
