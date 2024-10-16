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
  import { throttle, useQuasar } from "quasar";

  // Interface files
  import { BulletinTypes } from "@/interfaces/types/bulletin-types";
  import { CommunityNotice } from "@/interfaces/models/entities/community-notice";
  import { ENTITY_URL } from "@/constants";

  const { item } = defineProps<{
    item: BulletinTypes;
  }>();

  const noticeItem = computed(() => item as CommunityNotice);
  const { getTimeAgo, translate } = useUtilities();
  const $q = useQuasar();

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
        entityKey: ENTITY_URL.COMMUNITY
      }
    });
  }

  const throttledHandleDialog = throttle(onItemClick, 2000);
</script>
