<template>
  <div @click="$emit('on-directory-item')" class="cursor-pointer">
    <q-item :style="$q.screen.lt.sm ? 'max-width: 390px' : ''" class="full-width no-padding">
      <q-item-section avatar>
        <app-avatar-rounded :image-path="computedImagePath" size="54px" />
      </q-item-section>

      <q-item-section>
        <q-item-label lines="1">{{ line1 }}</q-item-label>
        <q-item-label caption lines="2">{{ line2 }}</q-item-label>
      </q-item-section>

      <q-item-section side v-if="!isCheckIn">
        <div class="q-col-gutter-sm" style="min-height: 32px">
          <q-icon :name="fasLocationDot" color="primary" size="xs" v-if="isCheckedIn" />
          <q-icon :name="fasHeart" color="red" size="xs" v-if="isFavorite" />
        </div>
        <q-item-label caption>{{ formattedDistance }}</q-item-label>
      </q-item-section>
    </q-item>
  </div>
</template>

<script setup lang="ts">
  import type { BusinessView } from "@/interfaces/models/views/business-view";
  import type { CategoryTypes } from "@/interfaces/types/category-types";
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

  const {
    entityKey,
    categoryItem,
    isCheckIn,
    i18nKey = ""
  } = defineProps<{
    categoryItem: CategoryTypes;
    entityKey: EntityURLKey;
    isCheckIn?: boolean;
    i18nKey?: string;
  }>();

  const { t, locale } = useI18n({ useScope: "global" });
  const { getEntityName, translate, dateFormatter } = useUtilities(locale.value);

  const checkInStore = useCheckInStore();
  const favoriteStore = useFavoriteStore();
  // const entityName = getEntityName(entityKey);

  const entityName = computed(() => {
    return getEntityName(entityKey);
  });

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

  const { getDistanceValue } = useSortCategoryItems(entityKey);

  const formattedDistance = computed(() => {
    const distance = getDistanceValue(categoryItem);
    const site = categoryItem as SiteView;
    switch (true) {
      case site.directoryTemplate === TEMPLATE.TAXI.value:
      case site.directoryTemplate === TEMPLATE.TIMETABLE.value:
      case site.directoryTemplate === TEMPLATE.EMERGENCY.value:
        return "N/A";
      case distance === Infinity:
        return "Infinity";
      case distance < 10:
        return "< 10M";
      case distance < 1000:
        return `${Math.round(distance)}M`;
      default:
        return `${(distance / 1000).toFixed(1)}KM`;
    }
  });
  const computedImagePath = computed(() => {
    if (isCheckIn) {
      return categoryItem.siteData?.iconPath ?? ""; // Use siteData.iconPath for check-in items
    }
    return categoryItem.iconPath ?? ""; // Use iconPath for general items
  });

  const line1 = computed(() => {
    if (isCheckIn) {
      const { siteName, meta } = categoryItem.siteData as SiteView;
      return siteName ? translate(siteName, meta, "siteName") : "";
    }

    if (categoryItem.directoryTemplate === 5) {
      return "";
    }

    const name = `${entityName.value}Name` as keyof CategoryTypes;
    return translate(categoryItem[name] as string, categoryItem.meta, name);
  });

  const line2 = computed(() => {
    if (isCheckIn) {
      const checkInfo = categoryItem.checkInfo;
      if (!checkInfo || !checkInfo.length) return "";
      const lastCheckIn = checkInfo.reduce(
        (
          latest: { checkInAt: string | number | Date },
          current: { checkInAt: string | number | Date }
        ) => (new Date(current.checkInAt) > new Date(latest.checkInAt) ? current : latest)
      );
      return lastCheckIn.checkInAt
        ? t(`${i18nKey}.checkIn.lastCheckIn`, {
            date: dateFormatter(lastCheckIn.checkInAt)
          })
        : "";
    }
    if (categoryItem.directoryTemplate === TEMPLATE.DAYTRIP.value) {
      return title.value;
    }
    if (categoryItem?.meta.template === TEMPLATE.TIMETABLE.value) {
      return title.value;
    }
    return translate(categoryItem.subtitle1, categoryItem.meta, "subtitle1");
  });

  const title = computed(() => {
    return translate(categoryItem.title, categoryItem.meta, "title");
  });
</script>
