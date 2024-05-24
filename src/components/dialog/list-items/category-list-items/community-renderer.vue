<template>
  <q-item-section avatar>
    <q-avatar size="64px">
      <q-img ratio="1" :src="getImageURL((item as PostingView)?.memberImage)">
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
</template>
<script setup lang="ts">
  // Interface files
  import { CategoryTypes } from "@/interfaces/types/category-types";
  import { Posting } from "@/interfaces/models/entities/posting";
  import { PostingView } from "@/interfaces/models/views/posting-view";

  import { useUserStore } from "@/stores/user";
  import { DirectoryTypes } from "@/interfaces/types/directory-types";

  const $q = useQuasar();
  const { getImageURL } = useUtilities();
  const emit = defineEmits(["item-click", "create-posting"]);

  const props = defineProps({
    item: {
      type: Object as PropType<CategoryTypes>,
      required: true
    },
    directory: {
      type: Object as PropType<DirectoryTypes>,
      required: false
    }
  });

  const { getTimeAgo } = useUtilities();

  const userStore = useUserStore();
  const memberName = (postItem: PostingView) =>
    postItem.memberAlias ?? `${postItem.memberFirstName} ${postItem.memberLastName}`;

  const memberTitle = (postItem: PostingView) =>
    postItem.title !== null && postItem.title !== undefined && postItem.title !== ""
      ? postItem.title
      : postItem.memberEmail;

  function handleItemClick(item: CategoryTypes) {
    emit("item-click", item);
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
</script>
