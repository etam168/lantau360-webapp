<template>
  <app-taxi-fleet-banner v-if="directory?.meta.template === 2 && hasTaxiFleet" />

  <q-table
    flat
    square
    :hide-pagination="categoryItems.length > 0"
    :hide-header="categoryItems.length > 0"
    :hide-bottom="categoryItems.length > 0"
    :row-key="`${entityName}Id`"
    :card-style="cardStyle"
    :rows="categoryItems"
    :style="tableStyle"
  >
    <!-- :style="tableStyle" -->
    <template v-slot:body="props">
      <q-tr :props="props">
        <q-td style="padding: 0">
          <app-category-item
            :image-path="props.row.iconPath"
            :line1="line1(props.row)"
            :line2="line2(props.row)"
            @click="handleDetail(props.row)"
          />
        </q-td>
      </q-tr>
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

  const cardStyle = computed(() => ({
    borderTop: "1px solid rgba(0, 0, 0, 0.12)",
    borderBottom: "1px solid rgba(0, 0, 0, 0.12)"
  }));

  const usedHeight = computed(() => {
    if (pageName === "FAVOURITE") {
      const width = Math.min($q.screen.width, 1024);
      const carouselHeight = (width * 9) / 16;
      return carouselHeight + 168;
    } else {
      return TAB_HEIGHT.value + BANNER_HEIGHT.value;
    }
  });

  const tableStyle = computed<Record<string, any> | undefined>(() => {
    const hasNoData = categoryItems.length === 0;
    const hasEnoughSpace = $q.screen.height - usedHeight.value > THRESHOLD.value;

    switch (true) {
      case hasNoData:
        return undefined;
      case hasEnoughSpace:
        return { height: `calc(100vh - ${usedHeight}px)` };
      default:
        return undefined;
    }
  });

  // Computed property to check if categoryItems contains "Taxi Fleet" in subtitle3
  const hasTaxiFleet = computed(() => categoryItems.some(item => item.subtitle3 === "Taxi Fleet"));

  function line1(item: CategoryTypes): string {
    if (directory && directory.groupId === 5) {
      return "";
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
  /* .q-table--grid .q-table__grid-content {
    flex: none;
  } */
</style>
