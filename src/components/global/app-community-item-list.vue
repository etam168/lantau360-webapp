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

    <app-tab-select
      :tab-items="tabItems"
      :current-tab="tab"
      @update:currentTab="setTab"
      class="q-pl-none"
    />

    <q-tab-panels v-model="tab" style="width: 100%; height: 100%">
      <q-tab-panel name="allDirectory" class="q-pa-none">
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
      </q-tab-panel>

      <q-tab-panel name="myDirectory" class="q-pa-none">
        <q-list v-if="directoryItems.length > 0">
          <template v-for="item in directoryItems" :key="item.directoryId">
            <div v-if="userStore.userId == (item as Posting).memberId">
              <q-item class="shadow-1 q-pa-sm q-mb-md">
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
            </div>
          </template>
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
      </q-tab-panel>
    </q-tab-panels>
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
  //import AppLoginDialogWidget from "@/components/dialog/app-login-dialog-widget.vue";
  const $q = useQuasar();
  // const router = useRouter();

  const emit = defineEmits(["item-click", "create-posting"]);
  const { eventBus } = useUtilities();

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

  const { getTimeAgo, translateAlt, translate } = useUtilities();
  const { t } = useI18n({ useScope: "global" });

  const userStore = useUserStore();

  const directoryName = computed(() => {
    const { directoryName, directoryNameAlt } = props.directory as CommunityDirectory;

    // Check if directoryNameAlt exists and is not null
    if (directoryNameAlt !== undefined && directoryNameAlt !== null) {
      return translateAlt(directoryName, directoryNameAlt, "directoryName");
    } else {
      return translate(directoryName, props?.directory?.meta, "directoryName");
    }
  });

  const setTab = (val: string) => (tab.value = val);
  const tab = ref("allDirectory");
  const tabItems = ref([
    {
      name: "allDirectory",
      label: t("community.tabItems.allDirectory", { directory: directoryName.value })
    },
    {
      name: "myDirectory",
      label: t("community.tabItems.myDirectory", { directory: directoryName.value })
    }
  ]);

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
    if (!userStore.isUserLogon()) {
      $q.dialog({
        component: defineAsyncComponent(
          () => import("@/components/dialog/app-login-dialog-widget.vue")
        )
      });
    } else {
      emit("create-posting");
    }
  }
  onMounted(() => {
    eventBus.on("on-login-success", () => {
      emit("create-posting");
    });
  });

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

  // const avatar = computed(() => {
  //   return userStore.profilePic ? `${BLOB_URL}/${userStore.profilePic}` : PLACEHOLDER_AVATAR;
  // });
</script>
