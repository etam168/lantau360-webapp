<template>
  <q-item clickable @click="$emit('on-directory-item')" :style="$q.screen.lt.sm ? 'max-width: 390px' : ''">
    <q-item-section avatar>
      <app-avatar-rounded :image-path="categoryItem.iconPath" size="54px" />
    </q-item-section>

    <q-item-section>
      <q-item-label lines="1">{{ line1 }}</q-item-label>
      <q-item-label caption lines="2">{{ line2 }}</q-item-label>
    </q-item-section>

    <q-item-section side>
      <div class="q-col-gutter-sm" style="min-height: 32px">
        <q-icon :name="fasLocationDot" color="primary" size="xs" v-if="isCheckedIn" />
        <q-icon :name="fasHeart" color="red" size="xs" v-if="isFavorite" />
      </div>

      <!-- <q-item-label caption>{{ formattedDistance }}</q-item-label> -->
    </q-item-section>
  </q-item>
</template>

<script setup lang="ts">
  import type { BusinessView } from "@/interfaces/models/views/business-view";
  import type { CategoryTypes } from "@/interfaces/types/category-types";
  import type { DirectoryTypes } from "@/interfaces/types/directory-types";
  import type { SiteView } from "@/interfaces/models/views/site-view";

  // Constants
  import { EntityURLKey, TEMPLATE } from "@/constants";
  import { fasHeart, fasLocationDot } from "@quasar/extras/fontawesome-v6";

  // Store
  import { useCheckInStore } from "@/stores/checkin-store";
  import { useFavoriteStore } from "@/stores/favorite-store";

  defineEmits<{
    (e: "on-directory-item"): void;
  }>();

  const { distance, entityKey, categoryItem, directory } = defineProps<{
    categoryItem: CategoryTypes;
    distance: number;
    entityKey: EntityURLKey;
    directory?: DirectoryTypes;
  }>();

  const { locale } = useI18n({ useScope: "global" });
  const { getEntityName, translate } = useUtilities(locale.value);

  const entityName = getEntityName(entityKey);
  const checkInStore = useCheckInStore();
  const favoriteStore = useFavoriteStore();

  const isCheckedIn = computed(() => {
    switch (entityKey) {
      case "SITE":
        const site = categoryItem as SiteView;
        return checkInStore.isCheckIn(site) && site.directoryTemplate != TEMPLATE.TAXI.value;
      default:
        return false;
    }
  });

  const isFavorite = computed(() => {
    switch (entityKey) {
      case "BUSINESS":
        return favoriteStore.isBusinessFavorite(categoryItem as BusinessView);
      case "SITE":
        return favoriteStore.isSiteFavorite(categoryItem as SiteView);
      default:
        return false;
    }
  });

  const formattedDistance = computed(() => {
    // Format distance:
    // - If less than 10 meter, return "< 10M"
    // - If less than 1KM, return meters with "M" suffix
    // - If 1KM or more, return kilometers with "KM" suffix
    switch (true) {
      case categoryItem.directoryTemplate === TEMPLATE.TAXI.value:
        return "";
      case categoryItem.directoryTemplate === TEMPLATE.TIMETABLE.value:
        return "";
      case categoryItem.directoryTemplate === TEMPLATE.EMERGENCY.value:
        return "";
      case distance === Infinity:
        return "";
      case distance < 10:
        return "< 10M";
      case distance < 1000:
        return `${Math.round(distance)}M`;
      default:
        return `${(distance / 1000).toFixed(1)}KM`;
    }
  });

  const line1 = computed(() => {
    if (directory && directory.groupId === 5) {
      return "";
    }

    const name = `${entityName}Name` as keyof CategoryTypes;
    return translate(categoryItem[name] as string, categoryItem.meta, name);
  });

  const line2 = computed(() => {
    if (directory && directory.groupId === 5) {
      return title.value;
    }
    if (directory?.meta.template === 3) {
      return title.value;
    }
    return translate(categoryItem.subtitle1, categoryItem.meta, "subtitle1");
  });

  const title = computed(() => {
    return translate(categoryItem.title, categoryItem.meta, "title");
  });
</script>
