<template>
  <q-card
    v-if="communityItems.length > 0"
    v-for="(item, index) in communityItems"
    :key="index"
    class="q-ma-md"
  >
    <q-list>
      <q-item class="q-pa-md">
        <q-item-section avatar>
          <app-avatar :image-path="(item as PostingView).memberImage" size="54px" />
        </q-item-section>

        <q-item-section>
          <q-item-label class="text-weight-bold">
            {{ line1(item) }}
          </q-item-label>

          <q-item-label caption class="text-weight-medium">
            {{ line2(item) }}
          </q-item-label>
        </q-item-section>

        <q-item-section side>
          <div class="text-grey-8 q-gutter-xs">
            <q-btn size="xs" dense flat :icon="fasEllipsis" @click="handleDetail(item)" />
            <q-btn
              size="xs"
              dense
              flat
              :icon="fasPencil"
              v-if="userStore.userId === item.createdBy"
              @click="handleEdit(item)"
            />
          </div>
        </q-item-section>
      </q-item>
    </q-list>
  </q-card>

  <app-no-record-message v-else :message="$t('errors.noRecord')" />
</template>

<script setup lang="ts">
  import { fasEllipsis, fasPencil } from "@quasar/extras/fontawesome-v6";
  import { formatTimeAgo } from "@vueuse/core";

  // Interface files
  import type { CategoryTypes } from "@/interfaces/types/category-types";
  import type { PostingView } from "@/interfaces/models/views/posting-view";

  // Constants
  import { EntityURLKey } from "@/constants";

  // Stores
  import { useUserStore } from "@/stores/user";

  // Emits
  const emits = defineEmits(["on-community-detail"]);

  // Props
  const { communityItems, entityKey } = defineProps<{
    communityItems: CategoryTypes[];
    entityKey: EntityURLKey;
  }>();

  const { locale } = useI18n({ useScope: "global" });
  const $q = useQuasar();
  const userStore = useUserStore();
  const { translate } = useUtilities(locale.value);

  // Functions for line1 and line2
  function line1(item: CategoryTypes): string {
    return (item as PostingView).memberFirstName || "";
  }

  function line2(item: CategoryTypes): string {
    const timeAgo = formatTimeAgo(new Date((item as PostingView).createdAt));
    const title = translate(item.title as string, item.meta, "title");
    return `${timeAgo} | ${title}`;
  }

  function handleDetail(item: CategoryTypes) {
    emits("on-community-detail", item);
  }

  function handleEdit(item: CategoryTypes) {
    $q.dialog({
      component: defineAsyncComponent(
        () => import("@/components/dialog/generic-gallery-edit-dialog/index.vue")
      ),
      componentProps: { row: item, entityKey }
    });
  }
</script>
