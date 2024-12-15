<!-- app-directory-items.vue -->
<template>
  <div class="row q-col-gutter-md" v-if="data.length > 0">
    <div
      v-for="(item, index) in sortedData"
      :key="index"
      :class="{
        'col-12': item.groupId === 5, // Full width column for groupId 5
        'col-4': $q.screen.lt.sm && item.groupId !== 5, // 3 columns for smaller screens (except groupId 5)
        'col-3': !$q.screen.lt.sm && item.groupId !== 5, // 4 columns for larger screens (except groupId 5)
        'justify-start': item.groupId === 5, // Justify-start for groupId 5
        'justify-center': item.groupId !== 5 // Default justify-center for other groupIds
      }"
      class="flex items-center"
    >
      <q-card flat>
        <q-card-section class="text-center">
          <app-avatar :image-path="item.imagePath" @click="handleClick(item)" />
          <q-item-label class="q-mt-sm">{{ getDirectoryTitle(item) }}</q-item-label>
        </q-card-section>
      </q-card>
    </div>
  </div>

  <div v-else class="text-h6 text-weight-regular q-mt-md text-grey-6 text-weight-bold text-center">
    {{ $t("errors.noRecord") }}
  </div>
</template>

<script setup lang="ts">
  import { DirectoryTypes } from "@/interfaces/types/directory-types";

  // Emits
  const emit = defineEmits(["on-directory-item"]);

  // Props
  const { data } = defineProps<{
    data: DirectoryTypes[];
  }>();

  const { locale } = useI18n({ useScope: "global" });

  const { translate, translateAlt } = useUtilities(locale.value);
  const $q = useQuasar();

  function getDirectoryTitle(item: DirectoryTypes) {
    const { shortName, shortNameAlt, meta } = item;

    return shortNameAlt != null
      ? translateAlt(shortName, shortNameAlt, "shortName")
      : translate(shortName, meta, "shortName");
  }

  const sortedData = computed(() => {
    const key = "directoryName";
    return [...data].sort((a, b) => {
      if (a.rank !== b.rank) return a.rank - b.rank;

      const directoryA = translate(a.directoryName, a.meta, key);
      const directoryB = translate(b.directoryName, b.meta, key);
      return directoryA.localeCompare(directoryB, undefined, { sensitivity: "base" });
    });
  });

  function handleClick(item: any) {
    emit("on-directory-item", item);
  }
</script>
