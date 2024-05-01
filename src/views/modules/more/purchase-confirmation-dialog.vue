<template>
  <q-dialog
    ref="dialogRef"
    transition-show="slide-up"
    transition-hide="slide-down"
    @update:model-value="updateDialogState"
    :model-value="isDialogVisible"
  >
    <q-card class="q-pa-md">
      <!-- <q-card-section class="row items-center q-pa-none q-mt-sm"> </q-card-section> -->

      <q-card-section class="text-center">
        <q-icon name="report_problem" size="4rem" :color="haveEnoughPoints ? 'red' : 'primary'" />
        <div class="text-h6">{{ title }}</div>
        <div class="text-body2" v-if="availabelPoints >= pointsPerPost">
          {{ $t("more.message.enoughPoints") }}
        </div>
        <div class="text-body2">{{ bodyMessage }}</div>
      </q-card-section>

      <q-card-actions v-if="haveEnoughPoints" align="right" class="no-wrap">
        <app-button
          class="q-mx-xs"
          :label="$t('action.ok')"
          color="primary"
          type="submit"
          v-close-popup
        />
      </q-card-actions>
      <q-card-actions v-else class="q-px-none no-wrap">
        <app-button
          class="full-width q-mx-xs"
          :label="$t('action.no')"
          color="red"
          type="submit"
          v-close-popup
        />

        <div class="q-mx-xs"></div>

        <app-button
          class="full-width"
          :label="$t('action.yes')"
          color="primary"
          type="submit"
          @click="handleOk"
        />
        <!-- <q-btn flat :label="$t('action.no')" color="primary" v-close-popup />
        <q-btn flat :label="$t('action.yes')" color="primary" @click="handleOk" /> -->
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
      ? t("more.profileSetting.pointLessThan50", { points: pointsPerPost })
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
