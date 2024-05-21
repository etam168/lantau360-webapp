<template>
  <q-item clickable @click="throttledHandleDialog">
    <q-item-section avatar>
      <q-avatar size="64px" square>
        <q-img :ratio="1" :src="getImageURL(newsItem.iconPath)" />
      </q-avatar>
    </q-item-section>

    <q-item-section>
      <q-item-label>{{ newsTime(newsItem) }}</q-item-label>
      <q-item-label>{{ newsItem?.communityNewsName }}</q-item-label>
      <q-item-label caption lines="2"> <div v-html="translatedContent"></div></q-item-label>
    </q-item-section>
  </q-item>

  <q-separator spaced inset />
</template>

<script setup lang="ts">
  // Quasar Import
  import { date, throttle, useQuasar } from "quasar";

  // Interface files
  import { BulletinTypes } from "@/interfaces/types/bulletin-types";
  import { CommunityNews } from "@/interfaces/models/entities/community-news";

  // .ts files

  const props = defineProps({
    item: {
      type: Object as PropType<BulletinTypes>,
      required: true
    }
  });

  const $q = useQuasar();
  const { translate, getImageURL } = useUtilities();
  const newsItem = computed(() => props.item as CommunityNews);

  const translatedContent: any = ref(
    translate(newsItem.value.description, newsItem.value.meta, "description")
  );

  const newsTime = (row: CommunityNews) => {
    // Check if modifiedAt is undefined or null, provide a default value
    const modifiedAt = row.modifiedAt
      ? date.formatDate(row.modifiedAt, "YYYY-MM-DD")
      : date.formatDate(Date.now(), "YYYY-MM-DDT09:00");

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

  const throttledHandleDialog = throttle(onItemClick, 2000);
</script>
