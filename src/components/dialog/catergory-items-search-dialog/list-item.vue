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
  // Quasar Import
  import { LocalStorage } from "quasar";

  // Third party imports
  import { fasHeart } from "@quasar/extras/fontawesome-v6";

  // Interface files
  import type { CategoryTypes } from "@/interfaces/types/category-types";

  // Constants
  import { EntityURLKey, STORAGE_KEYS } from "@/constants";

  // Emits
  const emits = defineEmits(["on-detail"]);

  // Props
  const { item, entityKey } = defineProps<{
    item: CategoryTypes;
    entityKey: EntityURLKey;
  }>();

  // Composable function calls
  const { getEntityName, getImageURL, translate } = useUtilities();
  const entityName = getEntityName(entityKey);

  const storageKey = computed(() =>
    entityKey === "BUSINESS" ? STORAGE_KEYS.SAVED.BUSINESS : STORAGE_KEYS.SAVED.SITE
  );

  const favoriteItems = ref((LocalStorage.getItem(storageKey.value) || []) as CategoryTypes[]);

  const isFavoriteItem = (item: CategoryTypes): boolean => {
    switch (entityKey) {
      case "BUSINESS":
        if ("businessId" in item) {
          return favoriteItems.value.some(
            favItem => "businessId" in favItem && favItem.businessId === item.businessId
          );
        }
        return false;
      case "SITE":
        if ("siteId" in item) {
          return favoriteItems.value.some(
            favItem => "siteId" in favItem && favItem.siteId === item.siteId
          );
        }
        return false;
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
