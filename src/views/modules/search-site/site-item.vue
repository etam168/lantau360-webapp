<template>
  <q-item clickable @click="handleDetail" class="shadow-1 q-mb-md q-pl-sm">
    <q-item-section avatar>
      <q-avatar size="64px" square>
        <q-img ratio="1" :src="computePath(row.iconPath)" />
      </q-avatar>
    </q-item-section>

    <q-item-section class="q-ml-lg">
      <q-item-label>
        {{ translate(row.title, row.meta, "title") }}
      </q-item-label>

      <q-item-label>
        {{ translate(row.subtitle1, row.meta, "subtitle1") }}
      </q-item-label>
    </q-item-section>

    <q-item-section side v-if="isFavoriteItem(row.siteId)">
      <q-icon name="favorite" size="2em" color="red" />
    </q-item-section>
  </q-item>
</template>

<script setup lang="ts">
  import { BLOB_URL, STORAGE_KEYS } from "@/constants";
  import { Site } from "@/interfaces/site";
  import { PropType, ref } from "vue";
  import { useUtilities } from "@/composable/use-utilities";
  import { LocalStorage } from "quasar";

  const favoriteItems = ref<any>(LocalStorage.getItem(STORAGE_KEYS.FAVOURITES) || []);

  const emits = defineEmits(["on-detail"]);

  const computePath = (path: string) => {
    return `${BLOB_URL}/${path}`;
  };

  const isFavoriteItem = (siteId: string | number): boolean => {
    return favoriteItems.value.some((item: any) => item.directoryId === siteId);
  };
  const { translate } = useUtilities();

  defineProps({
    row: {
      type: Object as PropType<Site>,
      required: true
    }
  });

  function handleDetail() {
    emits("on-detail");
  }
</script>
