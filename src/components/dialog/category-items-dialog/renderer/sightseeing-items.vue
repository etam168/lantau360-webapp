<template>
  <div class="full-height">
    <q-card flat bordered class="q-ma-md">
      <q-responsive :ratio="16 / 9">
        <q-card-section>{{
          translate(directory.shortName, directory.meta, "shortName")
        }}</q-card-section>
      </q-responsive>
    </q-card>
    <!-- <expansion-description-section :directory="directory" /> -->

    <app-category-list-items
      :categoryItems="categoryItems"
      :directory="directory"
      :entityKey="entityKey"
      @on-category-detail="onCategoryDetail"
      :style
    />
  </div>
</template>

<script setup lang="ts">
  import type { CategoryTypes } from "@/interfaces/types/category-types";
  import type { DirectoryTypes } from "@/interfaces/types/directory-types";
  import type { EntityURLKey } from "@/constants";

  // Props
  const { categoryItems, directory, entityKey, style } = defineProps<{
    categoryItems: CategoryTypes[];
    directory: DirectoryTypes;
    entityKey: EntityURLKey;
    style?: any;
  }>();

  // Emits
  const emits = defineEmits(["on-category-detail"]);

  const { locale } = useI18n({ useScope: "global" });
  const { translate } = useUtilities(locale.value);

  function onCategoryDetail(item: any) {
    emits("on-category-detail", item);
  }
</script>
