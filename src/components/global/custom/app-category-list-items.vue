<template>
  <q-card v-for="(item, index) in categoryItems" :key="index" class="q-ma-md">
    <q-card-section class="q-pa-none">
      <q-list>
        <q-item clickable @click="handleDetail(item)">
          <q-item-section avatar>
            <q-avatar size="64px" square>
              <q-img ratio="1" :src="getImageURL(item.iconPath)">
                <template v-slot:error>
                  <q-img ratio="1" :src="IMAGES.NO_IMAGE_AVAILABLE_PLACEHOLDER"></q-img>
                </template>
              </q-img>
            </q-avatar>
          </q-item-section>

          <q-item-section>
            <q-item-label> {{ line1(item) }} </q-item-label>
            <q-item-label> {{ line2(item) }} </q-item-label>
          </q-item-section>

          <q-item-section side>
            <div class="q-gutter-sm">
              <q-icon :name="fasLocationDot" size="xs" v-if="isCheckedIn(item)" />
              <q-icon :name="fasHeart" color="red" size="xs" v-if="isFavoriteItem(item)" />
            </div>
          </q-item-section>
        </q-item>
      </q-list>
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
  // Interface files
  import type { BusinessView } from "@/interfaces/models/views/business-view";
  import type { CategoryTypes } from "@/interfaces/types/category-types";
  import type { CheckIn } from "@/interfaces/models/entities/checkin";
  import type { SiteView } from "@/interfaces/models/views/site-view";

  // Constants
  import { EntityURLKey, STORAGE_KEYS, IMAGES } from "@/constants";
  import { fasHeart, fasLocationDot } from "@quasar/extras/fontawesome-v6";

  // Composables
  import { LocalStorage } from "quasar";

  // Emits
  const emits = defineEmits(["on-category-detail"]);

  // Props
  const {
    categoryItems,
    checkIns = [],
    entityKey
  } = defineProps<{
    categoryItems: CategoryTypes[];
    checkIns?: CheckIn[];
    entityKey: EntityURLKey;
  }>();

  const { getEntityName, getImageURL, translate } = useUtilities();
  const entityName = getEntityName(entityKey);

  const favoriteItems = ref([] as CategoryTypes[]);

  // Watch for changes in categoryItems and reload favorites
  watch(
    () => categoryItems,
    () => {
      switch (entityKey) {
        case "BUSINESS":
          favoriteItems.value = LocalStorage.getItem(STORAGE_KEYS.SAVED.BUSINESS) || [];
          break;
        case "SITE":
          favoriteItems.value = LocalStorage.getItem(STORAGE_KEYS.SAVED.SITE) || [];
          break;
        default:
          favoriteItems.value = [];
      }
    },
    { immediate: true, deep: true }
  );

  function line1(item: CategoryTypes) {
    const name = `${entityName}Name` as keyof CategoryTypes;

    return translate(item[name] as string, item.meta, name);
  }

  function line2(item: CategoryTypes) {
    return translate(item.subtitle1, item.meta, "subtitle1");
  }

  const isCheckedIn = (item: CategoryTypes): boolean => {
    if (entityKey == "SITE") {
      return checkIns.some(
        checkInItem => (checkInItem as CheckIn).siteId === (item as SiteView).siteId
      );
    }
    return false;
  };

  const isFavoriteItem = (item: CategoryTypes): boolean => {
    switch (entityKey) {
      case "BUSINESS":
        return favoriteItems.value.some(
          favItem => (favItem as BusinessView).businessId === (item as BusinessView).businessId
        );
      case "SITE":
        return favoriteItems.value.some(
          favItem => (favItem as SiteView).siteId === (item as SiteView).siteId
        );
      default:
        return false;
    }
  };

  function handleDetail(item: any) {
    emits("on-category-detail", item);
  }
</script>
