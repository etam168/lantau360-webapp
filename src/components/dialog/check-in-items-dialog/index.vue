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
        <Suspense>
          <template #default>
            <!-- <div>dialog</div> -->
            <!-- Main edit dialog content -->
            <q-page>
              <!-- Content here -->
              <checkin-items-content :category :entityKey @on-cancel="handleCancel" />
            </q-page>
          </template>

          <template #fallback>
            <!-- Loading spinner shown while content is loading -->
            <div class="row justify-center items-center" style="height: 500px">
              <app-spinner size="10em" />
            </div>
          </template>
        </Suspense>
      </q-page-container>
    </q-layout>
  </q-dialog>
</template>

<script setup lang="ts">
  import { CategoryTypes } from "@/interfaces/types/category-types";
  import { useDialogPluginComponent } from "quasar";

  import CheckinItemsContent from "./check-in-items-content.vue";
  import { EntityURLKey } from "@/constants";

  // Props
  const { category, entityKey } = defineProps<{
    category: CategoryTypes;
    entityKey: EntityURLKey;
  }>();
  const { eventBus } = useUtilities();
  const { dialogRef, onDialogCancel } = useDialogPluginComponent();
  const isDialogVisible = ref();
  const i18nKey = "home";

  onMounted(() => {
    eventBus("close-check-in-dialog").on(() => {
      handleCancel();
    });
  });

  function handleCancel() {
    onDialogCancel();
  }
</script>
