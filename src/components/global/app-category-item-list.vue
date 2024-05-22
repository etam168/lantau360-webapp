<template>
  <div
    v-if="template === TEMPLATE.DAYTRIP.value"
    :class="$q.screen.gt.xs ? 'row' : ''"
    class="q-gutter-md"
  >
    <daytrip-card :directory-items="directoryItems" @item-click="handleItemClick" />
  </div>

  <div v-else-if="isCommunityDirectory(directory)">
    <app-community-tab-item-list
      :directoryItems="directoryItems"
      :directory="directory as CommunityDirectory"
      @item-click="handleItemClick"
    />
  </div>

  <q-list v-else>
    <q-item
      clickable
      v-for="item in directoryItems"
      :key="item.directoryId"
      @click="handleItemClick(item)"
      class="shadow-1 q-pa-sm q-mb-md"
    >
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

      <q-item-section
        v-if="template === TEMPLATE.TIMETABLE.value || template === TEMPLATE.TAXI.value"
      >
        <q-item-label>
          {{ translate((item as SiteView).siteName, item.meta, "siteName") }}
        </q-item-label>
        <q-item-label>
          {{ translate(item.title, item.meta, "title") }}
        </q-item-label>
      </q-item-section>

      <q-item-section v-else>
        <q-item-label>
          {{ translate(item.title, item.meta, "title") }}
        </q-item-label>
        <q-item-label>
          {{ translate(item.subtitle1, item.meta, "subtitle1") }}
        </q-item-label>
      </q-item-section>

      <q-item-section side>
        <q-icon
          v-if="isFavoriteItem(item)"
          name="favorite"
          size="2em"
          color="red"
          class="favorite-icon"
        />
      </q-item-section>
      <q-item-section side style="padding-left: 0px">
        <q-icon
          v-if="isCheckedIn(item)"
          name="check"
          size="2em"
          color="green"
          class="checked-in-icon"
        />
      </q-item-section>
    </q-item>
  </q-list>
</template>

<script setup lang="ts">
  import DaytripCard from "../card/daytrip-card.vue";
  // Interface files
  import { BusinessView } from "@/interfaces/models/views/business-view";
  import { CategoryTypes } from "@/interfaces/types/category-types";
  import { SiteView } from "@/interfaces/models/views/site-view";

  // .ts files
  import { TEMPLATE } from "@/constants";
  import { CheckIn } from "@/interfaces/models/entities/checkin";
  import { DirectoryTypes } from "@/interfaces/types/directory-types";
  import { CommunityDirectory } from "@/interfaces/models/entities/community-directory";

  const emit = defineEmits(["item-click"]);

  const props = defineProps({
    directoryItems: {
      type: Array as PropType<CategoryTypes[]>,
      required: true,
      default: () => []
    },
    directory: {
      type: Object as PropType<DirectoryTypes>,
      required: true
    },
    favoriteItems: {
      type: Array as PropType<CategoryTypes[]>,
      default: () => []
    },
    template: {
      type: Number,
      required: false
    },
    directoryCheckIns: {
      type: Array as PropType<CheckIn[]>,
      required: true
    }
  });

  const { getImageURL, translate, isSiteView, isBusinessView, isCommunityDirectory } =
    useUtilities();

  const isFavoriteItem = (item: CategoryTypes): boolean => {
    switch (true) {
      case isBusinessView(item):
        return props.favoriteItems.some(
          favItem => (favItem as BusinessView).businessId === item.businessId
        );
      case isSiteView(item):
        return props.favoriteItems.some(favItem => (favItem as SiteView).siteId === item.siteId);
      default:
        return false;
    }
  };

  const isCheckedIn = (item: CategoryTypes): boolean => {
    if (isSiteView(item)) {
      return props.directoryCheckIns.some(
        checkInItem => (checkInItem as CheckIn).siteId === item.siteId
      );
    }
    return false;
  };

  function handleItemClick(item: CategoryTypes) {
    emit("item-click", item);
  }
</script>
