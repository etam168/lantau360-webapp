<template>
  <q-dialog
    ref="dialogRef"
    transition-show="slide-up"
    transition-hide="slide-down"
    :model-value="isDialogVisible"
    maximized
  >
    <q-layout view="lHh lpr lFf" class="bg-white" style="max-width: 1024px">
      <q-header class="bg-transparent text-dark">
        <app-dialog-title>{{ $t(`${i18nKey}.tabItems.checkin`) }}</app-dialog-title>
      </q-header>

      <q-page-container>
        <q-page>
          <!-- Content here -->
          <checkin-items-content :item="item" @on-cancel="handleCancel" />
        </q-page>
      </q-page-container>
    </q-layout>
  </q-dialog>
</template>

<script setup lang="ts">
  import { CategoryTypes } from "@/interfaces/types/category-types";
  import { useDialogPluginComponent } from "quasar";

  import CheckinItemsContent from "./check-in-items-content.vue";

  defineProps({
    item: {
      type: Object as PropType<CategoryTypes>,
      required: true
    }
  });
  const { eventBus } = useUtilities();
  const { dialogRef, onDialogCancel } = useDialogPluginComponent();
  const isDialogVisible = ref();
  const i18nKey = "home";

  onMounted(() => {
    eventBus.on("close-check-in-dialog", () => {
      handleCancel();
    });
  });
  function handleCancel() {
    onDialogCancel();
  }
</script>
