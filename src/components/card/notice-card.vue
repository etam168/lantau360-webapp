<template>
  <q-item clickable @click="onItemClick">
    <q-item-section>
      <q-item-label class="text-subtitle1">
        {{ translatedTitle }}
      </q-item-label>

      <q-item-label caption lines="2"> <div v-html="translatedContent"></div></q-item-label>
    </q-item-section>

    <q-item-section side>
      <q-item-label>{{ formatTimeAgo(new Date(noticeItem.createdAt)) }}</q-item-label>
    </q-item-section>
  </q-item>

  <q-separator spaced inset />
</template>

<script setup lang="ts">
  // Interface files
  import type { CategoryTypes } from "@/interfaces/types/category-types";
  import type { CommunityNotice } from "@/interfaces/models/entities/community-notice";

  import { formatTimeAgo } from '@vueuse/core'
  // .ts files
  import { EntityURLKey } from "@/constants";

  // Props
  const { item } = defineProps<{ item: CategoryTypes }>();

  const entityKey: EntityURLKey = "COMMUNITY_NOTICE";

  const { eventBus, translate } = useUtilities();
  const { openCategoryDetailDialog } = useCategoryDialogService(entityKey);

  const noticeItem = computed(() => item as CommunityNotice);

  const translatedContent: any = ref(
    translate(noticeItem.value.description, noticeItem.value.meta, "description")
  );

  const translatedTitle: any = ref(
    translate(noticeItem.value.title, noticeItem.value.meta, "title")
  );

  const onItemClick = () => {
    const dialogName = "NoticeDetail";
    eventBus("DialogStatus").emit(true, dialogName);
    openCategoryDetailDialog(item, dialogName);
  };
</script>
