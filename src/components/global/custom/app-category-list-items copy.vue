<template>
  <q-banner
    v-if="directory?.meta.template === 2 && hasTaxiFleet"
    class="q-ma-md shadow-1"
    rounded
    elevated
  >
    <template v-slot:avatar>
      <q-btn round unelevated :icon="fasCircleInfo" size="md" class="q-mr-md text-primary">
        <q-tooltip>Click for more information</q-tooltip>
      </q-btn>
    </template>
    Here is our collection of <span class="text-primary">Blue Taxis</span> operating in Lantau
    Island
  </q-banner>

  <q-list v-if="categoryItems.length > 0" v-for="(item, index) in categoryItems" :key="index">
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

  <app-no-record-message v-else :message="$t('errors.noRecord')" />
</template>

<script setup lang="ts">
  // Interface files
  import type { BusinessView } from "@/interfaces/models/views/business-view";
  import type { CategoryTypes } from "@/interfaces/types/category-types";
  import type { CheckIn } from "@/interfaces/models/entities/checkin";
  import type { DirectoryTypes } from "@/interfaces/types/directory-types";
  import type { SiteView } from "@/interfaces/models/views/site-view";

  // Constants
  import { EntityURLKey } from "@/constants";
  import { fasHeart, fasLocationDot, fasCircleInfo } from "@quasar/extras/fontawesome-v6";

  // Stores
  import { useFavoriteStore } from "@/stores/favorite-store";

  // Emits
  const emits = defineEmits(["on-category-detail"]);

  // Props
  const {
    categoryItems,
    checkIns = [],
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

  const entityName = getEntityName(entityKey);
  const favoriteStore = useFavoriteStore();

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

  const isCheckedIn = (item: CategoryTypes): boolean =>
    entityKey === "SITE" &&
    checkIns.some((checkInItem: CheckIn) => checkInItem.siteId === (item as SiteView).siteId);

  const isFavoriteItem = (item: CategoryTypes): boolean => {
    switch (entityKey) {
      case "BUSINESS":
        return favoriteStore.isFavoriteBusiness(item as BusinessView);
      case "SITE":
        return favoriteStore.isFavoriteSite(item as SiteView);
      default:
        return false;
    }
  };

  function handleDetail(item: any) {
    emits("on-category-detail", item);
  }
</script>
