<template>
  <q-dialog
    ref="dialogRef"
    transition-show="slide-up"
    transition-hide="slide-down"
    :model-value="dialogVisible"
  >
    <q-card class="q-dialog-style">
      <q-card-section class="q-dialog-header">
        <q-icon name="warning" size="2em" color="negative" class="q-warning-icon" />
        <q-card-title class="text-h6 q-warning-title">New Updates</q-card-title>
      </q-card-section>
      <q-separator />

      <q-card-section class="q-pb-none">
        <p>A new version is available. Do you want to refresh?</p>
      </q-card-section>

      <q-card-section class="q-dialog-buttons">
        <q-btn
          :label="$t('action.cancel')"
          class="q-mr-sm"
          color="primary"
          @click="onDialogCancel"
        />
        <q-btn
          :label="$t('action.delete')"
          color="negative"
          @click="
            () => {
              callBack();
              onDialogCancel();
            }
          "
        >
        </q-btn>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
  import { ref } from "vue";
  import { useDialogPluginComponent } from "quasar";

  const { dialogRef, onDialogCancel } = useDialogPluginComponent();

  const dialogVisible = ref(false);

  defineProps({
    callBack: {
      type: Function,
      required: true
    }
  });
</script>

<style scoped>
  .q-dialog-style {
    max-width: 400px;
    max-height: 180px;
    width: 100%;
    height: 100%;
  }

  .q-dialog-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10px;
  }

  .q-warning-icon {
    margin-right: 10px;
  }

  .q-warning-title {
    flex-grow: 1; /* Allow the title to take up remaining space */
  }

  .q-dialog-buttons {
    display: flex;
    justify-content: flex-end;
  }
</style>
