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
          <q-header class="bg-transparent text-dark">
            <app-dialog-title>{{ dialogTitle }}</app-dialog-title>
          </q-header>

          <q-page-container class="q-mx-md q-my-md">
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
  import { onMounted, ref } from "vue";

  // Custom Components
  import { useDialogPluginComponent } from "quasar";
  import CategoryItemsSearchContent from "./category-items-search-content.vue";

  // Constants
  import { EntityURLKey } from "@/constants/app/entity-url";

  const { eventBus } = useUtilities();
  const { t } = useI18n({ useScope: "global" });

  // Props
  const { query, entityKey } = defineProps<{
    query: any;
    entityKey: EntityURLKey;
  }>();

  const { dialogRef, onDialogHide } = useDialogPluginComponent();
  const isDialogVisible = ref();
  const i18nKey = "home";

  const dialogTitle = computed(() => {
    switch (entityKey) {
      case "SITE":
        return t(`${i18nKey}.siteSearch`);
      default:
        break;
    }
  });

  onMounted(() => {
    eventBus.on("SiteSearchDialog", () => {
      isDialogVisible.value = false;
    });
  });

  function updateDialogState(status: any) {
    isDialogVisible.value = status;
    eventBus.emit("DialogStatus", status, "SiteSearchDialog");
  }
</script>
