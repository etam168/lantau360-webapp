<template>
  <q-item clickable @click="onItemClick(item)">
    <q-item-section avatar>
      <q-avatar size="64px" square>
        <q-img ratio="1" :src="computePath(item.iconPath)" />
      </q-avatar>
    </q-item-section>

    <q-item-section>
      <q-item-label>{{ noticeTime(item) }}</q-item-label>
      <q-item-label
        ><q-badge color="primary" class="text-white"> {{ item?.title }} </q-badge></q-item-label
      >
      <q-item-label caption lines="2">{{ item?.description }}</q-item-label>
    </q-item-section>
  </q-item>

  <q-separator spaced inset />
</template>

<script setup lang="ts">
  // Vue Import

  import { BLOB_URL } from "@/constants";
  import { CommunityNotice } from "@/interfaces/models/entities/community-notice";
  import { PropType, defineAsyncComponent } from "vue";
  import { date, useQuasar } from "quasar";
  defineProps({
    item: {
      type: Object as PropType<CommunityNotice>,
      required: true
    }
  });

  const $q = useQuasar();

  const noticeTime = (row: any) => {
    // Check if row is null or undefined
    if (row === null || row === undefined) {
      return ""; // Return an empty string or any default value if row is null or undefined
    }

    // Check if modifiedAt is present in the row object
    const modifiedAt = row.modifiedAt
      ? date.formatDate(row.modifiedAt, "YYYY-MM-DD")
      : date.formatDate(Date.now(), "YYYY-MM-DD");

    return modifiedAt;
  };

  function onItemClick(item: any) {
    $q.dialog({
      component: defineAsyncComponent(() => import("@/components/dialog/notice-detail-dialog.vue")),
      componentProps: {
        query: { communityNoticeId: item.communityNoticeId }
      }
    });
  }

  const computePath = (path: string) => {
    return path ? `${BLOB_URL}/${path}` : "/no_image_available.jpeg";
  };
</script>
