<template>
  <q-card
    v-if="categoryItems.length > 0"
    v-for="(item, index) in categoryItems"
    :key="index"
    class="q-ma-md"
  >
    <q-list>
      <q-item clickable @click="handleDetail(item)" class="q-pa-sm">
        <q-item-section avatar>
          <app-avatar-square :image-path="item.iconPath" />
        </q-item-section>

        <q-item-section>
          <q-item-label v-if="line1(item)">{{ line1(item) }}</q-item-label>
          <q-item-label>{{ line2(item) }}</q-item-label>
        </q-item-section>

        <q-item-section side>
          <div class="q-gutter-sm">
            <q-icon :name="fasLocationDot" size="xs" v-if="isCheckedIn(item)" />
            <q-icon :name="fasHeart" color="red" size="xs" v-if="isFavoriteItem(item)" />
          </div>
        </q-item-section>
      </q-item>
    </q-list>
  </q-card>

  <app-no-record-message v-else :message="$t('errors.noRecord')" />
</template>

<script setup lang="ts">
  import type { CategoryTypes } from "@/interfaces/types/category-types";
  import type { CheckIn } from "@/interfaces/models/entities/checkin";
  import type { DirectoryTypes } from "@/interfaces/types/directory-types";
  import type { SiteView } from "@/interfaces/models/views/site-view";

  import { fasHeart, fasLocationDot } from "@quasar/extras/fontawesome-v6";
  import { EntityURLKey, IMAGES } from "@/constants";
  import { useFavoriteStore } from "@/stores/favorite-store";

  const emits = defineEmits(["on-category-detail"]);

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
  const { getEntityName, getImageURL, translate } = useUtilities(locale.value);

  const entityName = getEntityName(entityKey);
  const favoriteStore = useFavoriteStore();

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
    if (entityKey === "SITE") {
      return checkIns.some(
        checkInItem => (checkInItem as CheckIn).siteId === (item as SiteView).siteId
      );
    }
    return false;
  };

  const isFavoriteItem = (item: CategoryTypes): boolean => {
    return favoriteStore.isFavorite(item as any, entityKey);
  };

  function handleDetail(item: any) {
    emits("on-category-detail", item);
  }
</script>