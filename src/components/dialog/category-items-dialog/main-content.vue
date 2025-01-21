<template>
  <q-table v-bind="$attrs" flat square hide-header hide-pagination :rows="rows" :row-key="rowKey">
    <template v-slot:top>
      <q-card
        v-if="directory.groupId === SIGHTSEEING_GROUP"
        flat
        bordered
        class="q-ma-md full-height"
      >
        <q-responsive :ratio="16 / 9">
          <q-card-section>{{
            translate(directory.shortName, directory.meta, "shortName")
          }}</q-card-section>
        </q-responsive>
      </q-card>

      <app-tab-select
        v-if="hasGroup"
        :tab-items="tabItems"
        :current-tab="tab"
        @update:currentTab="setTab"
        :class="$q.screen.lt.sm ? 'justify-center' : ''"
      />

      <app-taxi-fleet-banner v-if="directoryTemplate === 2" />
    </template>

    <template v-slot:body="{ row }">
      <app-category-item
        :categoryItem="row"
        :directory
        :entityKey
        @on-directory-item="onCategoryDetail(row)"
      />
    </template>
  </q-table>
</template>

<script setup lang="ts">
  // Types
  import type { CategoryTypes } from "@/interfaces/types/category-types";
  import type { DirectoryTypes } from "@/interfaces/types/directory-types";

  // Constants
  import { EntityURLKey } from "@/constants";

  // Props
  const { categoryItems, directory, entityKey } = defineProps<{
    categoryItems: CategoryTypes[];
    directory: DirectoryTypes;
    entityKey: EntityURLKey;
  }>();

  const $q = useQuasar();
  const { locale } = useI18n({ useScope: "global" });
  const { getEntityKeyName, translate } = useUtilities(locale.value);
  const { openCategoryDetailDialog } = useCategoryDialogService(entityKey);

  const SIGHTSEEING_GROUP = 5 as const;

  const { tab, directoryTemplate, hasGroup, tabItems, rows, setTab } = useDirectoryGrouping(
    categoryItems,
    directory
  );

  const rowKey = computed(() => `${getEntityKeyName(entityKey)}Id`);

  function onCategoryDetail(item: any) {
    openCategoryDetailDialog(item, entityKey, directory.displayMask);
  }
</script>

<style lang="scss">
  .q-table__top {
    padding: 0 !important;
  }
</style>
