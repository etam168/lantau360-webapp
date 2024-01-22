<template>
  <q-item clickable @click="throttledHandleDialog">
    <q-item-section>
      <q-item-label
        ><q-badge color="primary" class="text-white">
          {{ noticeItem?.title }}
        </q-badge></q-item-label
      >
      <q-item-label caption lines="2"> <div v-html="noticeItem?.description"></div></q-item-label>
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

  const props = defineProps({
    item: {
      type: Object as PropType<BulletinTypes>,
      required: true
    }
  });

  const noticeItem = computed(() => props.item as CommunityNotice);
  const { getTimeAgo } = useUtilities();
  const $q = useQuasar();

  function onItemClick() {
    $q.dialog({
      component: defineAsyncComponent(
        () => import("@/components/dialog/bulletin-detail-dialog.vue")
      ),
      componentProps: {
        item: props.item
      }
    });
  }

  const throttledHandleDialog = throttle(onItemClick, 2000);
</script>
