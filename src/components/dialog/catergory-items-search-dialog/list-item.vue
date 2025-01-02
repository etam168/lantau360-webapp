<template>
  <q-item clickable @click="handleDetail" class="shadow-1 q-mb-md q-pl-sm">
    <q-item-section avatar>
      <q-avatar size="64px" square>
        <q-img ratio="1" :src="getImageURL(item.iconPath)" />
      </q-avatar>
    </q-item-section>

    <q-item-section>
      <q-item-label> {{ line1(item) }} </q-item-label>
      <q-item-label> {{ line2(item) }} </q-item-label>
    </q-item-section>

    <q-item-section side v-if="isFavoriteItem(item)">
      <q-icon :name="fasHeart" size="2em" color="red" />
    </q-item-section>
  </q-item>
</template>

<script setup lang="ts">
  import { fasHeart } from "@quasar/extras/fontawesome-v6";

  // Interface files
  import type { BusinessView } from "@/interfaces/models/views/business-view";
  import type { CategoryTypes } from "@/interfaces/types/category-types";
  import type { SiteView } from "@/interfaces/models/views/site-view";

  // Constants
  import { EntityURLKey } from "@/constants";

  // Stores
  import { useFavoriteStore } from "@/stores/favorite-store";

  // Emits
  const emits = defineEmits(["on-detail"]);

  // Props
  const { item, entityKey } = defineProps<{
    item: CategoryTypes;
    entityKey: EntityURLKey;
  }>();

  // Composable function calls
  const { locale } = useI18n({ useScope: "global" });
  const { getEntityName, getImageURL, translate } = useUtilities(locale.value);
  const entityName = getEntityName(entityKey);
  const favoriteStore = useFavoriteStore();

  const isFavoriteItem = (item: CategoryTypes): boolean => {
    switch (entityKey) {
      case "BUSINESS":
        return favoriteStore.isBusinessFavorite(item as BusinessView);
      case "SITE":
        return favoriteStore.isSiteFavorite(item as SiteView);
      default:
        return false;
    }
  };

  function line1(item: CategoryTypes) {
    const name = `${entityName}Name` as keyof CategoryTypes;
    return translate(item[name] as string, item.meta, name);
  }

  function line2(item: CategoryTypes) {
    return translate(item.subtitle1, item.meta, "subtitle1");
  }

  function handleDetail() {
    emits("on-detail");
  }
</script>
