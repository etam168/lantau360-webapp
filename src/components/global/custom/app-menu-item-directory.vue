<template>
  <q-card flat>
    <q-card-section class="text-center">
      <app-avatar :image-path="item.imagePath" @click="handleClick(item)" size="64px" />
      <q-item-label class="q-mt-sm">{{ getDirectoryTitle(item) }}</q-item-label>
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
  import { DirectoryTypes } from "@/interfaces/types/directory-types";

  // Emits
  const emit = defineEmits(["on-directory-item"]);

  // Props
  const { item } = defineProps<{
    item: DirectoryTypes;
  }>();

  const { locale } = useI18n({ useScope: "global" });
  const { translate } = useUtilities(locale.value);

  function getDirectoryTitle(item: DirectoryTypes) {
    const { shortName, shortNameAlt, meta } = item;
    return shortNameAlt != null
      ? translate(shortName, shortNameAlt, "shortName")
      : translate(shortName, meta, "shortName");
  }

  function handleClick(item: any) {
    emit("on-directory-item", item);
  }
</script>
