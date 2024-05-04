<template>
  <q-dialog
    ref="dialogRef"
    transition-show="slide-up"
    transition-hide="slide-down"
    @update:model-value="updateDialogState"
    :model-value="isDialogVisible"
  >
    <q-card class="q-pa-md">
      <q-card-section class="text-center">
        <q-icon name="report_problem" size="4rem" color="red" />
        <div class="text-h6">{{ $t("community.createPost.confirmation") }}</div>
        <div class="text-body2" v-if="haveEnoughPoints">
          {{ $t("community.createPost.confirmationQuestion", { pointsPerPost: pointsPerPost }) }}
        </div>
      </q-card-section>

      <q-card-actions class="q-px-none no-wrap">
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
          @click="createPosting"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
  import { CommunityDirectory } from "@/interfaces/models/entities/community-directory";
  import { useDialogPluginComponent } from "quasar";
  import { useUtilities } from "@/composable/use-utilities";
  //import { DirectoryTypes } from "@/interfaces/types/directory-types";
  import { useUserStore } from "@/stores/user";
  //import i18n from "@/plugins/i18n/i18n";

  const props = defineProps({
    item: {
      type: Object as PropType<CommunityDirectory>,
      required: true
    }
  });

  const { eventBus } = useUtilities();
  const { dialogRef, onDialogCancel } = useDialogPluginComponent();
  const { availabelPoints, pointsPerPost } = useUserStore();
  //   const { t } = i18n.global;
  const isDialogVisible = ref();
  const $q = useQuasar();

  //   const props = defineProps({
  //     callback: {
  //       type: Function,
  //       required: true
  //     },
  //     directory: {
  //       type: Object as PropType<DirectoryTypes>,
  //       required: true
  //     }
  //   });

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

  //   function handleOk() {
  //     props.callback(onDialogCancel);
  //   }

  function createPosting() {
    onDialogCancel();
    $q.dialog({
      component: defineAsyncComponent(() => import("./index.vue")),
      componentProps: {
        item: props.item as any
      }
    });
  }
</script>
