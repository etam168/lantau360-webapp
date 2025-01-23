<template>
  <q-card>
    <q-img :ratio="11 / 8" :src="getImageURL(item.imagePath)" />
    <q-separator color="white" />
    <q-card-section class="q-pa-sm">
      <q-item dense class="q-pa-none">
        <q-item-section>
          <q-item-label class="text-weight-medium">{{ getDirectorySubTitle(item) }}</q-item-label>
          <q-item-label class="text-caption">{{ getDirectoryTitle(item) }}</q-item-label>
        </q-item-section>
      </q-item>
    </q-card-section>
    <q-card-actions class="q-pt-none">
      <q-btn
        outline
        dense
        color="primary"
        :label="$t(`${i18nKey}.moreDetail`)"
        class="full-width"
        @click="handleClick(item)"
      />
    </q-card-actions>
  </q-card>
</template>

<script setup lang="ts">
  import { SiteDirectory } from "@/interfaces/models/entities/site-directory";

  // Emits
  const emit = defineEmits(["on-directory-item"]);

  // Props
  const { item, i18nKey = "" } = defineProps<{
    item: SiteDirectory;
    i18nKey?: string;
  }>();

  const { locale } = useI18n({ useScope: "global" });
  const { getImageURL, translate } = useUtilities(locale.value);

  function getDirectorySubTitle(item: SiteDirectory) {
    const { directoryName, meta } = item;

    return translate(directoryName, meta, "directoryName");
  }

  function getDirectoryTitle(item: SiteDirectory) {
    const { shortName, shortNameAlt, meta } = item;
    return shortNameAlt != null
      ? translate(shortName, shortNameAlt, "shortName")
      : translate(shortName, meta, "shortName");
  }

  function handleClick(item: any) {
    emit("on-directory-item", item);
  }
</script>
