<template>
  <div v-if="template === TEMPLATE.DAYTRIP.value" class="row q-gutter-md">
    <q-card
      clickable
      v-for="item in directoryItems"
      :key="item.directoryId"
      @click="handleItemClick(item)"
      class="my-card"
      style="width: 300px"
    >
      <q-img
        :ratio="16 / 9"
        :src="item.iconPath ? `${BLOB_URL}/${item.iconPath}` : '/img/icons/no_image_available.jpeg'"
      >
        <template v-slot:error>
          <div class="absolute-full flex flex-center bg-negative text-white">
            {{ $t("errors.cannotLoadImage") }}
          </div>
        </template>
      </q-img>

      <q-card-section>
        <q-list>
          <q-item class="q-pa-none">
            <q-item-section>
              <q-item-label overline>{{ translate(item.title, item.meta, "title") }}</q-item-label>
              <q-item-label caption>Estimated Time: 2-3 hrs</q-item-label>
              <q-separator spaced />
              <q-item-label lines="2"><app-text-editor v-model="item.description" /></q-item-label>
            </q-item-section>

            <q-item-section side top>
              <q-icon name="favorite" size="2em" color="red" class="favorite-icon" />
            </q-item-section>
          </q-item>
        </q-list>
      </q-card-section>
    </q-card>
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
          <q-img
            ratio="1"
            :src="
              item.iconPath ? `${BLOB_URL}/${item.iconPath}` : '/img/icons/no_image_available.jpeg'
            "
          >
            <template v-slot:error>
              <div class="absolute-full flex flex-center bg-negative text-white">
                {{ $t("errors.cannotLoadImage") }}
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
  import { SiteView } from "@/interfaces/models/views/site-view";

  // .ts files
  import { BLOB_URL, TEMPLATE } from "@/constants";

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
