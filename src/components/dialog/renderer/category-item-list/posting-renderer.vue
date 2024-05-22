<template>
  <app-community-tab-item-list
    :directoryItems="directoryItems"
    :directory="directory as CommunityDirectory"
    @item-click="handleItemClick"
  />
</template>

<script setup lang="ts">
  // Interface files
  import { CategoryTypes } from "@/interfaces/types/category-types";

  // .ts files
  import { DirectoryTypes } from "@/interfaces/types/directory-types";
  import { CommunityDirectory } from "@/interfaces/models/entities/community-directory";

  const emit = defineEmits(["item-click"]);

  defineProps({
    directoryItems: {
      type: Array as PropType<CategoryTypes[]>,
      required: true,
      default: () => []
    },
    directory: {
      type: Object as PropType<DirectoryTypes>,
      required: true
    }
  });

  function handleItemClick(item: CategoryTypes) {
    emit("item-click", item);
  }
</script>
