<template>
  <q-item clickable @click="handleDetail" class="shadow-1 q-mb-md q-pl-sm">
    <q-item-section avatar>
      <q-avatar size="64px" square>
        <q-img ratio="1" :src="getImageURL(siteItem.iconPath)" />
      </q-avatar>
    </q-item-section>

    <q-item-section>
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
  import { LocalStorage } from "quasar";

  // Interface files
  import { SiteView } from "@/interfaces/models/views/site-view";

  // .ts files
  import { STORAGE_KEYS } from "@/constants";

  const props = defineProps({
    row: {
      type: Object as PropType<SiteView>,
      required: true
    }
  });

  const favoriteItems = ref((LocalStorage.getItem(STORAGE_KEYS.SAVED.SITE) || []) as SiteView[]);
  const emits = defineEmits(["on-detail"]);
  const { translate, getImageURL } = useUtilities();

  const siteItem = computed(() => props.row);

  const isFavoriteItem = (siteId: string | number): boolean => {
    return favoriteItems.value.some((item: any) => item.directoryId === siteId);
  };

  function handleDetail() {
    emits("on-detail");
  }
</script>
