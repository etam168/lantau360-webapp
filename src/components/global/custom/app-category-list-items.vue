<template>
  <q-list>
    <q-item clickable @click="handleDetail(item)" v-for="(item, index) in categoryItems" :key="index">
      <q-item-section avatar>
        <q-avatar size="64px" square>
          <q-img ratio="1" :src="getImageURL(item.iconPath)">
            <template v-slot:error>
              <div class="absolute-full flex flex-center bg-negative text-white">
                {{ $t("errors.cannotLoadImage") }}
              </div>
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
          <q-icon name="mdi-map-marker" size="xs" v-if="isCheckedIn(item)" />
          <q-icon name="mdi-heart" color="red" size="xs" v-if="isFavoriteItem(item)" />
        </div>
      </q-item-section>
    </q-item>
  </q-list>
</template>

<script setup lang="ts">
  // Interface files
  import { CategoryTypes } from "@/interfaces/types/category-types";

  // .ts files
  import { EntityURLKey, STORAGE_KEYS, TEMPLATE } from "@/constants";
  import { CheckIn } from "@/interfaces/models/entities/checkin";
  import { SiteView } from "@/interfaces/models/views/site-view";
  import { LocalStorage } from "quasar";
  import { BusinessView } from "@/interfaces/models/views/business-view";

  const { getEntityName, getImageURL, translate } = useUtilities();

  const emits = defineEmits(["on-detail"]);

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

  const entityName = getEntityName(entityKey);

  const items = computed(() => {
    switch (entityKey) {
      case "BUSINESS":
        return ["business"];
      case "SITE":
        return ["site"];
      default:
        return ["N/A"];
    }
  });

  const favoriteItems = computed((): CategoryTypes[] => {
    switch (entityKey) {
      case "BUSINESS":
        return (LocalStorage.getItem(STORAGE_KEYS.SAVED.BUSINESS) || []) as BusinessView[];
      case "SITE":
        return (LocalStorage.getItem(STORAGE_KEYS.SAVED.SITE) || []) as SiteView[];
      default:
        return [];
    }
  });

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
    emits("on-detail", item);
  }
</script>
