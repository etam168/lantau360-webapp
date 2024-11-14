<template>
  <q-item clickable @click="throttledHandleDialog">
    <q-item-section>
      <q-item-label class="text-subtitle1">
        {{ translatedTitle }}
      </q-item-label>

      <q-item-label caption lines="2"> <div v-html="translatedContent"></div></q-item-label>
    </q-item-section>

    <q-item-section side>
      <q-item-label>{{ getTimeAgo(noticeItem.createdAt) }}</q-item-label>
    </q-item-section>
  </q-item>

  <q-separator spaced inset />
</template>

<script setup lang="ts">
  // Quasar Import
  import { throttle, useQuasar } from "quasar";

  // Interface files
  import type { CategoryTypes } from "@/interfaces/types/category-types";
  import type { CommunityNotice } from "@/interfaces/models/entities/community-notice";

  // .ts files
  import { EntityURLKey } from "@/constants";

  // Props
  const { item } = defineProps<{ item: CategoryTypes }>();

  const entityKey: EntityURLKey = "COMMUNITY_NOTICE";

  const $q = useQuasar();
  const { getTimeAgo, translate } = useUtilities();

  const noticeItem = computed(() => item as CommunityNotice);

  const translatedContent: any = ref(
    translate(noticeItem.value.description, noticeItem.value.meta, "description")
  );

  const translatedTitle: any = ref(
    translate(noticeItem.value.title, noticeItem.value.meta, "title")
  );

  function onItemClick() {
    $q.dialog({
      component: defineAsyncComponent(
        () => import("@/components/dialog/category-detail-dialog/index.vue")
      ),
      componentProps: {
        category: item,
        entityKey: entityKey
      }
    });
  }

  const throttledHandleDialog = throttle(onItemClick, 2000);
</script>
