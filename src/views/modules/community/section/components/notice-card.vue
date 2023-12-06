<template>
  <q-item clickable @click="onItemClick(data)">
    <q-item-section avatar>
      <q-avatar size="64px" square>
        <q-img ratio="1" :src="computePath(data?.imagePath)" />
      </q-avatar>
    </q-item-section>

    <q-item-section>
      <q-item-label>{{ noticeTime(data?.date) }}</q-item-label>
      <q-item-label
        ><q-badge color="primary" class="text-white"> {{ data?.title }} </q-badge></q-item-label
      >
      <q-item-label caption lines="2">{{ data?.description }}</q-item-label>
    </q-item-section>
  </q-item>

  <q-separator spaced inset />
</template>

<script setup lang="ts">
  // Vue Import
  import { BLOB_URL, PLACEHOLDER_THUMBNAIL } from "@/constants";
  import { CommunityNotice } from "@/interfaces/models/entities/community-notice";
  import { PropType, defineAsyncComponent } from "vue";
  import { date, useQuasar } from "quasar";

  const props = defineProps({
    data: {
      type: Object as PropType<CommunityNotice>,
      required: true
    }
  });

  const $q = useQuasar();

  const noticeTime = (row: any) => {
    debugger;
    console.log(props.data);
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
      component: defineAsyncComponent(() => import("../notice-detail-dialog.vue")),
      componentProps: {
        query: { communityNoticeId: item.communityNoticeId }
      }
    });
  }

  const computePath = (path: string) => {
    return path ? `${BLOB_URL}/${path}` : PLACEHOLDER_THUMBNAIL;
  };
</script>
