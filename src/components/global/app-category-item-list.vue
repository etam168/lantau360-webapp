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
        <div>
          {{
            (item as PostingView)?.memberImage
              ? computePath((item as PostingView)?.memberImage)
              : PLACEHOLDER_AVATAR
          }}
        </div>
        <q-avatar size="64px">
          <q-img
            ratio="1"
            :src="
              (item as PostingView)?.memberImage
                ? computePath((item as PostingView)?.memberImage)
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

      <q-item v-else-if="(item as PostingView).postingId" class="q-pa-none" style="width: 100%">
        <q-item-section>
          <q-item-label> {{ memberName(item as PostingView) }} </q-item-label>
          <q-item-label> {{ memberTitle(item as PostingView) }} </q-item-label>
        </q-item-section>
        <q-space />
        <q-item-section side top
          ><q-item-label>{{ getTimeAgo(item.createdAt) }}</q-item-label>
        </q-item-section>
      </q-item>

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

  const { translate, getTimeAgo } = useUtilities();

  // const sortedItems = computed(() => {
  //   return props.directoryItems
  //     .slice()
  //     .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  // });

  // sortedItems.value.sort((a, b) =>
  //   a.title.localeCompare(b.title, undefined, { sensitivity: "base" })
  // );

  const computePath = (path: string) => {
    return path ? `${BLOB_URL}/${path}` : "./img/icons/no_image_available.jpeg";
  };

  const memberName = (postItem: PostingView) =>
    postItem.memberAlias ?? `${postItem.memberFirstName} ${postItem.memberLastName}`;

  const memberTitle = (postItem: PostingView) =>
    postItem.title !== null && postItem.title !== undefined && postItem.title !== ""
      ? postItem.title
      : postItem.memberEmail;

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
