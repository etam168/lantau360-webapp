<template>
  <q-dialog
    ref="dialogRef"
    transition-show="slide-up"
    transition-hide="slide-down"
    @update:model-value="updateDialogState"
    :model-value="isDialogVisible"
    persistent
  >
    <q-card>
      <q-card-section>
        <q-avatar :icon="fasTriangleExclamation" color="warning" text-color="white" />
        <span class="q-ml-sm">Warning</span>
      </q-card-section>

      <q-card-section>
        <p>Create post will cost you 50 points</p>
        <p>Are you sure you want to continue?</p>
      </q-card-section>

      <q-card-actions align="right">
        <app-button flat label="Yes" v-close-popup @click="onConfirm" />
        <app-button flat label="No" v-close-popup @click="onCancel" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
  import { CommunityDirectory } from "@/interfaces/models/entities/community-directory";
  // Quasar Import
  import { useDialogPluginComponent } from "quasar";

  //Composable
  import { useBaseDialog } from "@/composable/use-base-dialog";

  // Third party imports
  import { fasTriangleExclamation } from "@quasar/extras/fontawesome-v6";

  import { EntityURLKey } from "@/constants";

  // Props
  const {
    directory,
    entityKey,
  } = defineProps<{
    directory: CommunityDirectory;
    entityKey: EntityURLKey;
  }>();

  // Emits
  defineEmits([...useDialogPluginComponent.emits]);

  // Reactive variables
  const { openCreatePosting } = useCommunityDialogService(entityKey);

  // Use the base dialog composition
  const {
    dialogRef,
    isDialogVisible,
    updateDialogState
  } = useBaseDialog();
  const i18nKey = "dialog";

  const onConfirm = () => {
    openCreatePosting(isDialogVisible, directory);
  };

  const onCancel = () => {
    // Do nothing, simply dismiss the dialog
    isDialogVisible.value = false;
  };
</script>
