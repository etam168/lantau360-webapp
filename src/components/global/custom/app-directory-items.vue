<template>
  <div class="row q-col-gutter-md" v-if="data.length > 0">
    <div
      v-for="(item, index) in sortedData"
      :key="index"
      :class="[
        item.groupId === 5
          ? $q.screen.lt.sm
            ? 'col-6'
            : 'col-3' // For groupId 5, col-6 on small screens, col-3 on larger screens
          : $q.screen.lt.sm
            ? 'col-4'
            : 'col-3' // For other items, col-4 on small screens, col-3 on larger screens
      ]"
      class="flex justify-center items-center"
    >
      <!-- Use q-card for groupId 5 -->
      <q-card v-if="item.groupId === 5" class="my-card full-width">
        <q-img :ratio="11 / 8" :src="getImageURL(item.imagePath)" />
        <q-separator color="white" />
        <q-card-section class="q-pa-sm">
          <q-item dense class="q-pa-none">
            <q-item-section>
              <q-item-label class="text-weight-medium">{{
                getDirectorySubTitle(item)
              }}</q-item-label>
              <q-item-label class="text-caption">{{ getDirectoryTitle(item) }}</q-item-label>
            </q-item-section>
          </q-item>
        </q-card-section>
        <q-card-actions class="q-pt-none">
          <q-btn
            outline
            dense
            color="primary"
            :label="$t('more Detail')"
            class="full-width"
            @click="handleClick(item)"
          />
        </q-card-actions>
      </q-card>

      <q-card flat v-else>
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

  const { getImageURL, translate, translateAlt } = useUtilities(locale.value);
  const $q = useQuasar();

  function getDirectoryTitle(item: DirectoryTypes) {
    const { shortName, shortNameAlt, meta } = item;

    return shortNameAlt != null
      ? translateAlt(shortName, shortNameAlt, "shortName")
      : translate(shortName, meta, "shortName");
  }

  function getDirectorySubTitle(item: DirectoryTypes) {
    const { directoryName, meta } = item;

    return translate(directoryName, meta, "directoryName");
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
