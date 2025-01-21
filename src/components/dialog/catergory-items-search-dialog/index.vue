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
          <app-dialog-title :i18nKey has-options @change:sort-option="handleChangeSortOptions">{{
            dialogTitle
          }}</app-dialog-title>

          <q-page-container>
            <category-items-search-content
              class="q-mt-xs"
              v-model:keyword="keyword"
              :entityKey
              :sortByKey
            />
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
  // Custom Components
  import CategoryItemsSearchContent from "./category-items-search-content.vue";

  // Constants
  import { EntityURLKey } from "@/constants/app/entity-url";
  import { useBaseDialog } from "@/composable/use-base-dialog";

  // Props
  const { entityKey, i18nKey } = defineProps<{
    entityKey: EntityURLKey;
    i18nKey: string;
  }>();

  // v-model
  const keyword = defineModel<string>("keyword", {
    required: false,
    default: ""
  });

  // Composable function calls
  const { t } = useI18n({ useScope: "global" });

  // Use the base dialog composition
  const { dialogRef, onDialogHide, isDialogVisible, updateDialogState } = useBaseDialog();

  // Reactive variables
  const sortByKey = ref("default");

  const dialogTitle = computed(() => {
    return t(`${i18nKey}.searchBar.title`);
  });

  /**
   * Handles the sorting
   */
  const handleChangeSortOptions = (sortBy: string) => {
    sortByKey.value = sortBy;
  };
</script>
