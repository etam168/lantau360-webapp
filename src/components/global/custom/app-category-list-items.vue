<template>
  <q-table
    v-bind="$attrs"
    flat
    square
    hide-pagination
    hide-header
    :hide-bottom="categoryItems.length > 0"
    :row-key="`${entityName}Id`"
    :card-style="cardStyle"
    :rows="categoryItems"
  >
    <!-- :style="tableStyle" -->
    <template v-slot:body="props">
      <q-tr :props="props">
        <q-td style="padding: 0">
          <app-category-item
            :image-path="props.row.iconPath"
            :line1="line1(props.row)"
            :line2="line2(props.row)"
            @click="handleDetail(props.row)"
          />
        </q-td>
      </q-tr>
    </template>

    <template v-slot:no-data>
      <app-no-record-message v-if="categoryItems.length <= 0" :message="$t('errors.noRecord')" />
    </template>
  </q-table>
</template>

<script setup lang="ts">
  // Interface files
  import type { CategoryTypes } from "@/interfaces/types/category-types";
  import type { DirectoryTypes } from "@/interfaces/types/directory-types";

  // Constants
  import { EntityURLKey } from "@/constants";

  // Emits
  const emits = defineEmits(["on-category-detail"]);

  // Props
  const { categoryItems, entityKey, directory } = defineProps<{
    categoryItems: CategoryTypes[];
    entityKey: EntityURLKey;
    directory?: DirectoryTypes;
  }>();

  const { locale } = useI18n({ useScope: "global" });
  const { getEntityName, translate } = useUtilities(locale.value);

  const entityName = getEntityName(entityKey);

  const cardStyle = computed(() => ({
    borderTop: "1px solid rgba(0, 0, 0, 0.12)",
    borderBottom: "1px solid rgba(0, 0, 0, 0.12)"
  }));

  function line1(item: CategoryTypes): string {
    if (directory && directory.groupId === 5) {
      return "";
    }
    const name = `${entityName}Name` as keyof CategoryTypes;
    return translate(item[name] as string, item.meta, name);
  }

  function line2(item: CategoryTypes): string {
    if (directory && directory.groupId === 5) {
      return title(item);
    }
    if (directory?.meta.template === 3) {
      return title(item);
    }
    return translate(item.subtitle1, item.meta, "subtitle1");
  }

  function title(item: CategoryTypes) {
    return translate(item.title, item.meta, "title");
  }

  function handleDetail(item: any) {
    emits("on-category-detail", item);
  }
</script>
