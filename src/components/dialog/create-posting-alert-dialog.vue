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
        <app-button flat label="Yes"  v-close-popup @click="onConfirm" />
        <app-button flat label="No"  v-close-popup @click="onCancel" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
  import { CommunityDirectory } from "@/interfaces/models/entities/community-directory";
  // Quasar Import
  import { useDialogPluginComponent } from "quasar";

  // Third party imports
  import { fasTriangleExclamation } from "@quasar/extras/fontawesome-v6";

  import { EntityURLKey } from "@/constants";

  // Props
  const {
    directory,
    entityKey,
    dialogName = "ItemListDialog"
  } = defineProps<{
    directory: CommunityDirectory;
    entityKey: EntityURLKey;
    dialogName: string;
  }>();

  // Emits
  defineEmits([...useDialogPluginComponent.emits]);
  const { eventBus } = useUtilities();

  // Reactive variables
  const isDialogVisible = ref(true);
  const { dialogRef, onDialogOK } = useDialogPluginComponent();
  const { openCreatePosting } = useCommunityDialogService(entityKey);

  const i18nKey = "dialog";

  function updateDialogState(status: boolean): void {
    isDialogVisible.value = status;
  }

  const onConfirm = () => {
    // Open the dialog for creating the post
    const dialogName = "PostingListDialog";
    eventBus("DialogStatus").emit(true, dialogName);
    openCreatePosting(isDialogVisible, directory);
  };

  const onCancel = () => {
    // Do nothing, simply dismiss the dialog
    isDialogVisible.value = false;
  };

  // Lifecycle hooks
  onMounted(() => {
    const timeout = Math.random() * 100000; // random timeout up to 100 seconds
    setTimeout(() => {
      if (isDialogVisible.value) {
        isDialogVisible.value = false; // Close the dialog after the timeout
      }
    }, timeout);
  });
</script>
