<template>
  <q-list>
    <q-item clickable v-for="(item, index) in categoryItems" :key="index">
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
        <q-item-label> {{ items[0] }} </q-item-label>
        <q-item-label> {{ items[0] }} </q-item-label>
      </q-item-section>

      <q-item-section side>
        <div class="q-gutter-sm">
          <q-icon name="check" size="xs" />
          <q-icon name="fa-solid fa-heart" color="red" size="xs" />
        </div>
      </q-item-section>
    </q-item>
  </q-list>

  <!-- <q-card
    v-if="categoryItems.length == 0"
    flat
    style="min-height: calc(100vh - 228px)"
    class="row justify-center items-center"
  >
    <q-card-section class="text-center">
      <div class="text-h6 text-weight-regular q-mt-md text-grey-6 text-weight-bold text-center">
        {{ $t("errors.noRecord") }}
      </div>
    </q-card-section>
  </q-card> -->
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

  const { getImageURL } = useUtilities();

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
</script>
