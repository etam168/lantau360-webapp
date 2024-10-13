<!-- generic-directory-item-list.vue -->
<template>
  <div class="row q-col-gutter-md" v-if="data.length > 0">
    <div
      v-for="(item, index) in sortedData"
      :key="index"
      :class="$q.screen.lt.sm ? 'col-4' : 'col-3'"
      class="flex justify-center items-center"
    >
      <q-card flat>
        <q-card-section class="text-center">
          <app-avatar :image-path="item.imagePath" @click="$emit('on-directory-item', item)" />
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

  const { translate, translateAlt } = useUtilities();
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
</script>
