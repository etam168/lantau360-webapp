<template>
  <app-taxi-fleet-banner v-if="directory?.meta.template === 2 && hasTaxiFleet" />

  <q-scroll-area
    v-if="$q.screen.height - usedHeight > THRESHOLD && categoryItems.length > 0"
    :style="scrollAreaStyle"
  >
    <!-- <div>BANNER_HEIGHT:{{ BANNER_HEIGHT }}</div>
    <div>TAB_HEIGHT:{{ TAB_HEIGHT }}</div>
    <div>usedHeight:{{ usedHeight }}</div> -->
    <q-list v-for="(item, index) in categoryItems" :key="index">
      <q-item clickable @click="handleDetail(item)">
        <q-item-section avatar>
          <app-avatar-rounded :image-path="item.iconPath" />
        </q-item-section>

        <q-item-section>
          <q-item-label>{{ line1(item) }}</q-item-label>
          <q-item-label caption>{{ line2(item) }}</q-item-label>
        </q-item-section>

        <q-item-section side>
          <div class="q-gutter-sm">
            <q-icon :name="fasLocationDot" size="xs" v-if="isCheckedIn(item)" />
            <q-icon :name="fasHeart" color="red" size="xs" v-if="isFavoriteItem(item)" />
          </div>
        </q-item-section>
      </q-item>

      <q-separator />
    </q-list>
  </q-scroll-area>

  <q-list v-else v-for="(item, index) in categoryItems" :key="index">
    <q-item clickable @click="handleDetail(item)">
      <q-item-section avatar>
        <app-avatar-rounded :image-path="item.iconPath" />
      </q-item-section>

      <q-item-section>
        <q-item-label>{{ line1(item) }}</q-item-label>
        <q-item-label caption>{{ line2(item) }}</q-item-label>
      </q-item-section>

      <q-item-section side>
        <div class="q-gutter-sm">
          <q-icon :name="fasLocationDot" size="xs" v-if="isCheckedIn(item)" />
          <q-icon :name="fasHeart" color="red" size="xs" v-if="isFavoriteItem(item)" />
        </div>
      </q-item-section>
    </q-item>

    <q-separator />
  </q-list>

  <app-no-record-message v-if="categoryItems.length <= 0" :message="$t('errors.noRecord')" />
</template>

<script setup lang="ts">
  import { fasHeart, fasLocationDot } from "@quasar/extras/fontawesome-v6";

  // Interface files
  import type { BusinessView } from "@/interfaces/models/views/business-view";
  import type { CategoryTypes } from "@/interfaces/types/category-types";
  import type { CheckIn } from "@/interfaces/models/entities/checkin";
  import type { DirectoryTypes } from "@/interfaces/types/directory-types";
  import type { SiteView } from "@/interfaces/models/views/site-view";

  // Constants
  import { EntityURLKey } from "@/constants";

  // Stores
  import { useCheckInStore } from "@/stores/checkin-store";
  import { useFavoriteStore } from "@/stores/favorite-store";

  // Emits
  const emits = defineEmits(["on-category-detail"]);

  // Props
  const {
    categoryItems,
    checkIns = [], // to do remove
    entityKey,
    directory
  } = defineProps<{
    categoryItems: CategoryTypes[];
    checkIns?: CheckIn[];
    entityKey: EntityURLKey;
    directory?: DirectoryTypes;
  }>();

  const { locale } = useI18n({ useScope: "global" });
  const { getEntityName, translate } = useUtilities(locale.value);

  const $q = useQuasar();
  const entityName = getEntityName(entityKey);
  const checkInStore = useCheckInStore();
  const favoriteStore = useFavoriteStore();
  const THRESHOLD = 150;

  const TAB_HEIGHT = computed(() => {
    return directory?.meta?.groupByKey !== "none" ? 51 + 51 : 51;
  });

  const BANNER_HEIGHT = computed(() => {
    return directory?.meta?.template === 2 && hasTaxiFleet.value ? 78 : 0;
  });

  const usedHeight = computed(() => {
    return TAB_HEIGHT.value + BANNER_HEIGHT.value;
  });

  const scrollAreaStyle = computed(() => {
    return { height: `calc(100vh - ${usedHeight.value}px)` };
  });

  // Computed property to check if categoryItems contains "Taxi Fleet" in subtitle3
  const hasTaxiFleet = computed(() => categoryItems.some(item => item.subtitle3 === "Taxi Fleet"));

  function line1(item: CategoryTypes): string | null {
    if (directory && directory.groupId === 5) {
      return null;
    }
    const name = `${entityName}Name` as keyof CategoryTypes;
    return translate(item[name] as string, item.meta, name);
  }

  function line2(item: CategoryTypes): string {
    if (directory && directory.groupId === 5) {
      return title(item);
    }
    if (directory?.meta.template === 3) {
      return title(item);
    }
    return translate(item.subtitle1, item.meta, "subtitle1");
  }

  function title(item: CategoryTypes) {
    return translate(item.title, item.meta, "title");
  }

  const isCheckedIn = (item: CategoryTypes): boolean => {
    switch (entityKey) {
      case "SITE":
        return checkInStore.isCheckIn(item as SiteView);
      default:
        return false;
    }
  };

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

  function handleDetail(item: any) {
    emits("on-category-detail", item);
  }
</script>
