<template>
  <q-item clickable @click="handleDetail" class="shadow-1 q-mb-md q-pl-sm">
    <q-item-section avatar>
      <q-avatar size="64px" square>
        <q-img ratio="1" :src="computePath(row.imagePath)" />
      </q-avatar>
    </q-item-section>

    <q-item-section class="q-ml-lg">
      <q-item-label>
        {{ translate(row.directoryName, row.meta, "directoryName") }}
      </q-item-label>

      <q-item-label>
        {{ translate(row.shortName, row.meta, "shortNameAlt") }}
      </q-item-label>
    </q-item-section>

    <q-item-section side v-if="isFavoriteItem(row.communityDirectoryId)">
      <q-icon name="favorite" size="2em" color="red" />
    </q-item-section>
  </q-item>
</template>

<script setup lang="ts">
  import { BLOB_URL, STORAGE_KEYS } from "@/constants";
  import { CommunityDirectory } from "@/interfaces/models/entities/communityDirectory";
  import { PropType, ref } from "vue";
  import { useUtilities } from "@/composable/use-utilities";
  import { LocalStorage } from "quasar";

  const favoriteItems = ref<any>(LocalStorage.getItem(STORAGE_KEYS.FAVOURITES) || []);

  const emits = defineEmits(["on-detail"]);

  const computePath = (path: string) => {
    return path ? `${BLOB_URL}/${path}` : "/no_image_available.jpeg";
  };
  const { translate } = useUtilities();

  defineProps({
    row: {
      type: Object as PropType<CommunityDirectory>,
      required: true
    }
  });

  function handleDetail() {
    emits("on-detail");
  }
  const isFavoriteItem = (communityDirectoryId: string | number): boolean => {
    return favoriteItems.value.some((item: any) => item.directoryId === communityDirectoryId);
  };
</script>
