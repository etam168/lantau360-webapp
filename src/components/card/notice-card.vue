<template>
  <q-item clickable @click="onItemClick">
    <q-item-section avatar>
      <q-avatar size="64px" square>
        <q-img :ratio="1" :src="imagePath" />
      </q-avatar>
    </q-item-section>

    <q-item-section>
      <q-item-label>{{ noticeTime(noticeItem) }}</q-item-label>
      <q-item-label
        ><q-badge color="primary" class="text-white">
          {{ noticeItem?.title }}
        </q-badge></q-item-label
      >
      <q-item-label caption lines="2"> <div v-html="noticeItem?.description"></div></q-item-label>
    </q-item-section>
  </q-item>

  <q-separator spaced inset />
</template>

<script setup lang="ts">
  import { date } from "quasar";

  // Interface files
  import { BulletinTypes } from "@/interfaces/types/bulletin-types";
  import { CommunityNotice } from "@/interfaces/models/entities/community-notice";

  // .ts files
  import { BLOB_URL } from "@/constants";

  const props = defineProps({
    item: {
      type: Object as PropType<BulletinTypes>,
      required: true
    }
  });

  const noticeItem = computed(() => props.item as CommunityNotice);

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

  const imagePath = computed(() => {
    return noticeItem.value.iconPath
      ? `${BLOB_URL}/${noticeItem.value.iconPath}`
      : "./img/icons/no_image_available.jpeg";
  });
</script>
