<template>
  <div>
    <q-card class="q-pa-md q-mb-md">
      <q-input
        rounded
        standout
        bottom-slots
        v-model="textModel"
        :placeholder="$t('community.createPost.inputPlaceholder')"
        dense
        @click="createPosting"
      >
        <template v-slot:before>
          <q-avatar size="45px">
            <img :src="avatar" />
          </q-avatar>
        </template>
      </q-input>

      <q-separator />

      <q-card-actions class="justify-center q-px-none q-pb-none q-pt-md">
        <q-list dense>
          <q-item dense class="q-pa-none">
            <q-item-section v-for="postItem in postItems" :key="postItem.title">
              <q-item clickable dense @click="createPosting">
                <q-item-section avatar>
                  <q-icon color="primary" :name="postItem.icon" />
                </q-item-section>

                <q-item-section>
                  <q-item-label>{{ $t(postItem.title) }}</q-item-label>
                </q-item-section>
              </q-item>
            </q-item-section>
          </q-item>
        </q-list>
      </q-card-actions>
    </q-card>

    <q-list v-if="directoryItems.length > 0">
      <q-item
        v-for="item in directoryItems"
        :key="item.directoryId"
        class="shadow-1 q-pa-sm q-mb-md"
      >
        <q-item-section avatar>
          <q-avatar size="64px">
            <q-img
              ratio="1"
              :src="
                (item as PostingView)?.memberImage
                  ? `${BLOB_URL}/${(item as PostingView)?.memberImage}`
                  : '/img/icons/no_image_available.jpeg'
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

        <q-item class="q-pa-none" style="width: 100%">
          <q-item-section>
            <q-item-label> {{ memberName(item as PostingView) }} </q-item-label>
            <q-item-label> {{ memberTitle(item as PostingView) }} </q-item-label>
          </q-item-section>
          <q-space />
          <q-item-section side top class="q-pa-none"
            ><q-item-label>{{ getTimeAgo(item.createdAt) }}</q-item-label>
            <q-item class="q-pa-none">
              <q-item-section class="q-pa-none">
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
              <q-item-section side style="padding-left: 0px">
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
            </q-item>
          </q-item-section>
        </q-item>
      </q-item>
    </q-list>
    <q-card
      flat
      v-else
      style="min-height: calc(100vh - 228px)"
      class="row justify-center items-center"
    >
      <q-card-section class="text-center">
        <div class="text-h6 text-weight-regular q-mt-md text-grey-6 text-weight-bold">
          {{ $t("errors.noRecord") }}
        </div>
      </q-card-section>
    </q-card>
  </div>
</template>
<script setup lang="ts">
  // Interface files
  import { CategoryTypes } from "@/interfaces/types/category-types";
  import { PostingView } from "@/interfaces/models/views/posting-view";
  import { useUserStore } from "@/stores/user";

  // .ts files
  import { BLOB_URL, PLACEHOLDER_AVATAR } from "@/constants";
  import { Posting } from "@/interfaces/models/entities/posting";
  import { CommunityDirectory } from "@/interfaces/models/entities/community-directory";
  const $q = useQuasar();

  const emit = defineEmits(["item-click", "create-posting"]);

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
    template: {
      type: Number,
      required: false
    }
  });

  const { getTimeAgo } = useUtilities();

  const userStore = useUserStore();
  const textModel = ref("");

  const memberName = (postItem: PostingView) =>
    postItem.memberAlias ?? `${postItem.memberFirstName} ${postItem.memberLastName}`;

  const memberTitle = (postItem: PostingView) =>
    postItem.title !== null && postItem.title !== undefined && postItem.title !== ""
      ? postItem.title
      : postItem.memberEmail;

  function handleItemClick(item: CategoryTypes) {
    emit("item-click", item);
  }

  function createPosting() {
    emit("create-posting");
  }

  function editPosting(item: Posting) {
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

  const avatar = computed(() => {
    return userStore.profilePic ? `${BLOB_URL}/${userStore.profilePic}` : PLACEHOLDER_AVATAR;
  });

  const postItems = ref([
    { icon: "description", title: "community.createPost.title" },
    { icon: "collections", title: "community.createPost.photos" }
  ]);
</script>
