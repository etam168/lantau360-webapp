<template>
  <suspense>
    <template #default>
      <q-dialog
        ref="dialogRef"
        @hide="onDialogHide"
        transition-show="slide-up"
        transition-hide="slide-down"
        @update:model-value="updateDialogState"
        :model-value="isDialogVisible"
        maximized
      >
        <q-layout view="lHh lpr lFf" class="bg-white" style="max-width: 1024px">
          <app-dialog-title>{{ dialogTitle }}</app-dialog-title>

          <q-page-container>
            <category-items-search-content :query :entity-key />
          </q-page-container>
        </q-layout>
      </q-dialog>
    </template>
    <template #fallback>
      <div class="row justify-center items-center" style="height: 500px"></div>
    </template>
  </suspense>
</template>

<script setup lang="ts">
  // Quasar Import
  import { useDialogPluginComponent } from "quasar";

  // Custom Components
  import CategoryItemsSearchContent from "./category-items-search-content.vue";

  // Constants
  import { EntityURLKey } from "@/constants/app/entity-url";

  // Props
  const { query, entityKey } = defineProps<{
    query: any;
    entityKey: EntityURLKey;
  }>();

  // Composable function calls
  const { eventBus } = useUtilities();
  const { t } = useI18n({ useScope: "global" });
  const { dialogRef, onDialogHide } = useDialogPluginComponent();

  // Reactive variables
  const isDialogVisible = ref();

  const dialogTitle = computed(() => {
    switch (entityKey) {
      case "SITE":
        return t(`home.searchBar.siteSearch`);
      case "BUSINESS":
        return t(`business.searchBar.businessSearch`);
      default:
        break;
    }
  });

  function updateDialogState(status: any) {
    isDialogVisible.value = status;
    eventBus("DialogStatus").emit(status, "SiteSearchDialog");
  }

  // Lifecycle hooks
  onMounted(() => {
    eventBus("SiteSearchDialog").on(() => {
      isDialogVisible.value = false;
    });
  });
</script>
