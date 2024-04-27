<template>
  <div>
    <q-card class="q-mb-md">
      <q-item clickable v-ripple @click="createPosting">
        <q-item-section avatar>
          <q-avatar color="green-1" text-color="primary" icon="add" />
        </q-item-section>

        <q-item-section>
          <q-item-label>{{
            $t("action.createDirectory", { directoryName: directoryName })
          }}</q-item-label>
          <q-item-label caption>{{
            $t("community.createPost.addGalleryDescription")
          }}</q-item-label></q-item-section
        >
      </q-item>
    </q-card>

    <q-slide-transition>
      <div v-show="visible">
        <q-card class="row justify-center q-mb-md">
          <q-card-section :style="$q.screen.gt.xs ? 'width: 300px' : 'width : 100%'">
            <q-img :src="checkinImage" />
            <q-item-label
              style="font-weight: 600"
              class="text-caption text-grey-8 text-center q-mt-sm"
            >
              {{ $t("community.loginDialog.subtitle") }}
            </q-item-label>
            <q-card-actions class="q-px-none no-wrap">
              <!-- <div class="row"> -->

              <app-button
                class="full-width"
                label="Cancel"
                color="red"
                type="submit"
                @click="handleCancel"
              />
              <div class="q-mx-xs"></div>
              <app-button
                class="full-width"
                :label="$t('auth.login.button')"
                color="primary"
                type="submit"
                @click="handleOk"
              />

              <!-- </div> -->
            </q-card-actions>
          </q-card-section>
        </q-card>
      </div>
    </q-slide-transition>

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
  import { BLOB_URL } from "@/constants";
  import { Posting } from "@/interfaces/models/entities/posting";
  import { CommunityDirectory } from "@/interfaces/models/entities/community-directory";
  const $q = useQuasar();
  // const router = useRouter();

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

  const { eventBus, getTimeAgo, translateAlt, translate } = useUtilities();

  const userStore = useUserStore();
  //const textModel = ref("");
  const visible = ref(false);
  const checkinImage = ref("/img/icons/checkin.jpg");

  const memberName = (postItem: PostingView) =>
    postItem.memberAlias ?? `${postItem.memberFirstName} ${postItem.memberLastName}`;

  const memberTitle = (postItem: PostingView) =>
    postItem.title !== null && postItem.title !== undefined && postItem.title !== ""
      ? postItem.title
      : postItem.memberEmail;

  function handleItemClick(item: CategoryTypes) {
    emit("item-click", item);
  }

  function handleCancel() {
    visible.value = false;
  }

  function handleOk() {
    eventBus.emit("navigateToMore");
  }

  function createPosting() {
    if (!userStore.isUserLogon()) {
      visible.value = true;
    } else {
      visible.value = false;
      emit("create-posting");
    }
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

  const directoryName = computed(() => {
    const { directoryName, directoryNameAlt } = props.directory as CommunityDirectory;

    // Check if directoryNameAlt exists and is not null
    if (directoryNameAlt !== undefined && directoryNameAlt !== null) {
      return translateAlt(directoryName, directoryNameAlt, "directoryName");
    } else {
      return translate(directoryName, props?.directory?.meta, "directoryName");
    }
  });

  // const avatar = computed(() => {
  //   return userStore.profilePic ? `${BLOB_URL}/${userStore.profilePic}` : PLACEHOLDER_AVATAR;
  // });
</script>
