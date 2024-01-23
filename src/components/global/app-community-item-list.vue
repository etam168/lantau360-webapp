<template>
  <q-list>
    <q-item v-for="item in directoryItems" :key="item.directoryId" class="shadow-1 q-pa-sm q-mb-md">
      <q-item-section avatar>
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

      <q-item class="q-pa-none" style="width: 100%">
        <q-item-section>
          <q-item-label> {{ memberName(item as PostingView) }} </q-item-label>
          <q-item-label> {{ memberTitle(item as PostingView) }} </q-item-label>
        </q-item-section>
        <q-space />
        <q-item-section side top
          ><q-item-label>{{ getTimeAgo(item.createdAt) }}</q-item-label>
          <q-item class="q-pa-none">
            <q-item-section class="q-pa-none">
              <q-btn
                color="primary"
                icon="info"
                size="md"
                dense
                flat
                rounded
                @click="handleItemClick(item)"
              />
            </q-item-section>
            <q-item-section class="q-pa-none" side>
              <q-btn
                color="primary"
                icon="edit"
                size="md"
                dense
                flat
                rounded
                @click="editPosting(item as PostingView)"
                v-if="userStore.userId == (item as Posting).memberId"
              />
            </q-item-section>
          </q-item>
        </q-item-section>
      </q-item>

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
  import { useUserStore } from "@/stores/user";

  // .ts files
  import { BLOB_URL, PLACEHOLDER_AVATAR } from "@/constants";
  import { Posting } from "@/interfaces/models/entities/posting";
  import { CommunityDirectory } from "@/interfaces/models/entities/community-directory";
  const $q = useQuasar();

  const emit = defineEmits(["item-click"]);

  const props = defineProps({
    directoryItems: {
      type: Array as PropType<CategoryTypes[]>,
      required: true,
      default: () => []
    },
    directory: {
      type: Object as PropType<CommunityDirectory>,
      required: false
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

  const { getTimeAgo } = useUtilities();

  const userStore = useUserStore();
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

  function editPosting(item: Posting) {
    debugger;
    $q.dialog({
      component: defineAsyncComponent(
        () => import("@/views/modules/community/edit-dialog/index.vue")
      ),
      componentProps: {
        directory: props.directory,
        postingData: item
      }
    });
  }
</script>
