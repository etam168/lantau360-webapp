<template>
  <app-taxi-fleet-banner v-if="directory?.meta.template === 2 && hasTaxiFleet" />
  <q-table
    grid
    flat
    :rows="categoryItems"
    :row-key="`${entityName}Id`"
    hide-pagination
    :style="tableStyle"
    :rows-per-page-options="[0]"
  >
    <template v-slot:item="props">
      <q-item
        clickable
        @click="handleDetail(props.row)"
        class="full-width"
        style="height: fit-content"
      >
        <q-item-section avatar>
          <app-avatar-rounded :image-path="props.row.iconPath" />
        </q-item-section>

        <q-item-section>
          <q-item-label>{{ line1(props.row) }}</q-item-label>
          <q-item-label caption>{{ line2(props.row) }}</q-item-label>
        </q-item-section>

        <q-item-section side>
          <div class="q-gutter-sm">
            <q-icon :name="fasLocationDot" size="xs" v-if="isCheckedIn(props.row)" />
            <q-icon :name="fasHeart" color="red" size="xs" v-if="isFavoriteItem(props.row)" />
          </div>
        </q-item-section>
      </q-item>

      <q-separator />
    </template>
    <template v-slot:no-data>
      <app-no-record-message v-if="categoryItems.length <= 0" :message="$t('errors.noRecord')" />
    </template>
  </q-table>
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
    checkIns = [],
    entityKey,
    directory,
    pageName
  } = defineProps<{
    categoryItems: CategoryTypes[];
    checkIns?: CheckIn[];
    entityKey: EntityURLKey;
    directory?: DirectoryTypes;
    pageName?: string;
  }>();

  const { locale } = useI18n({ useScope: "global" });
  const { getEntityName, translate } = useUtilities(locale.value);

  const $q = useQuasar();
  const entityName = getEntityName(entityKey);
  const checkInStore = useCheckInStore();
  const favoriteStore = useFavoriteStore();

  const THRESHOLD = computed(() => {
    return pageName === "FAVOURITE" ? 320 : 150;
  });

  const TAB_HEIGHT = computed(() => {
    return directory?.meta?.groupByKey !== "none" ? 51 + 51 : 51;
  });

  const BANNER_HEIGHT = computed(() => {
    return directory?.meta?.template === 2 && hasTaxiFleet.value ? 78 : 0;
  });

  const usedHeight = computed(() => {
    if (pageName === "FAVOURITE") {
      const width = Math.min($q.screen.width, 1024);
      const carouselHeight = (width * 9) / 16;
      return carouselHeight + 193;
    } else {
      return TAB_HEIGHT.value + BANNER_HEIGHT.value;
    }
  });

  const scrollAreaStyle = computed(() => {
    return { height: `calc(100vh - ${usedHeight.value}px)` };
  });

  const tableStyle = computed(() => {
    return $q.screen.height - usedHeight.value > THRESHOLD.value ? scrollAreaStyle.value : {};
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

<style>
  .q-table--grid .q-table__grid-content {
    flex: none;
  }
</style>
