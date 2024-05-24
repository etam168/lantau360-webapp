<template>
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

  <q-item-section v-if="template === TEMPLATE.TIMETABLE.value || template === TEMPLATE.TAXI.value">
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
</template>
<script setup lang="ts">
  import { SiteView } from "@/interfaces/models/views/site-view";
  import { CategoryTypes } from "@/interfaces/types/category-types";
  import { TEMPLATE } from "@/constants";
  import { CheckIn } from "@/interfaces/models/entities/checkin";
  import { BusinessView } from "@/interfaces/models/views/business-view";

  const props = defineProps({
    item: {
      type: Object as PropType<CategoryTypes>,
      required: true
    },
    template: {
      type: Number,
      required: false
    },
    favoriteItems: {
      type: Array as PropType<CategoryTypes[]>,
      default: () => []
    },
    directoryCheckIns: {
      type: Array as PropType<CheckIn[]>,
      required: true
    }
  });

  const { isSiteView, isBusinessView, getImageURL, translate } = useUtilities();

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
</script>
