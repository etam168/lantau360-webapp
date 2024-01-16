<template>
  <q-list>
    <q-item
      clickable
      v-for="item in directoryItems"
      :key="item.directoryId"
      @click="handleItemClick(item)"
      class="shadow-1 q-pa-sm q-mb-md"
    >
      <q-item-section v-if="(item as PostingView).postingId" avatar>
        <q-avatar size="64px">
          <q-img
            ratio="1"
            :src="
              (item as PostingView)?.memberImage
                ? (item as PostingView)?.memberImage
                : PLACEHOLDER_AVATAR
            "
          >
            <template v-slot:error>
              <div class="absolute-full flex flex-center bg-negative text-white">
                Cannot load image
              </div>
            </template>
          </q-img>
        </q-avatar>
      </q-item-section>

      <q-item-section avatar v-else>
        <q-avatar size="64px" square>
          <q-img ratio="1" :src="computePath(item.iconPath)">
            <template v-slot:error>
              <div class="absolute-full flex flex-center bg-negative text-white">
                Cannot load image
              </div>
            </template>
          </q-img>
        </q-avatar>
      </q-item-section>

      <q-item-section v-if="template === TEMPLATE.TIMETABLE.value">
        <q-item-label>
          {{ translate((item as SiteView).siteName, item.meta, "siteName") }}
        </q-item-label>

        <q-item-label>
          {{ translate(item.title, item.meta, "title") }}
        </q-item-label>
      </q-item-section>

      <q-item-section v-else-if="template === TEMPLATE.TAXI.value">
        <q-item-label>
          {{ translate((item as SiteView).siteName, item.meta, "siteName") }}
        </q-item-label>

        <q-item-label>
          {{ translate(item.title, item.meta, "title") }}
        </q-item-label>
      </q-item-section>

      <q-item-section v-else-if="(item as PostingView).postingId">
        <q-item-label>
          {{ translate((item as PostingView).postingName, item.meta, "postingName") }}
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
    </q-item>
  </q-list>
</template>

<script setup lang="ts">
  // Interface files
  import { BusinessView } from "@/interfaces/models/views/business-view";
  import { CategoryTypes } from "@/interfaces/types/category-types";
  import { PostingView } from "@/interfaces/models/views/posting-view";
  import { SiteView } from "@/interfaces/models/views/site-view";

  // .ts files
  import { BLOB_URL, PLACEHOLDER_AVATAR, TEMPLATE } from "@/constants";

  const emit = defineEmits(["item-click"]);

  const props = defineProps({
    directoryItems: {
      type: Array as PropType<CategoryTypes[]>,
      required: true,
      default: () => []
    },
    favoriteItems: {
      type: Array as PropType<CategoryTypes[]>,
      default: () => []
    },
    template: {
      type: Number,
      required: false
    }
  });

  const { translate } = useUtilities();

  const computePath = (path: string) => {
    return path ? `${BLOB_URL}/${path}` : "./img/icons/no_image_available.jpeg";
  };

  const isFavoriteItem = (item: CategoryTypes): boolean => {
    switch (true) {
      case "businessId" in item:
        return props.favoriteItems.some(
          favItem => (favItem as BusinessView).businessId === item.businessId
        );
      case "siteId" in item:
        return props.favoriteItems.some(favItem => (favItem as SiteView).siteId === item.siteId);
      default:
        // No known type matched, or it's not a favorite item
        return false;
    }
  };

  function handleItemClick(item: CategoryTypes) {
    emit("item-click", item);
  }
</script>
