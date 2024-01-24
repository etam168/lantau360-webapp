<template>
  <q-item clickable @click="handleDetail" class="shadow-1 q-mb-md q-pl-sm">
    <q-item-section avatar>
      <q-avatar size="64px" square>
        <q-img ratio="1" :src="computeIconPath" />
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
  import { BLOB_URL, STORAGE_KEYS } from "@/constants";
  import { useUtilities } from "@/composable/use-utilities";

  const props = defineProps({
    row: {
      type: Object as PropType<SiteView>,
      required: true
    }
  });

  const favoriteItems = ref((LocalStorage.getItem(STORAGE_KEYS.SAVED.SITE) || []) as SiteView[]);
  const emits = defineEmits(["on-detail"]);

  const siteItem = computed(() => props.row);

  const computeIconPath = computed(() => {
    return siteItem.value.iconPath
      ? `${BLOB_URL}/${siteItem.value.iconPath}`
      : "./img/icons/no_image_available.jpeg";
  });

  const isFavoriteItem = (siteId: string | number): boolean => {
    return favoriteItems.value.some((item: any) => item.directoryId === siteId);
  };
  const { translate } = useUtilities();

  function handleDetail() {
    emits("on-detail");
  }
</script>
