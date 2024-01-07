<template>
  <q-list padding class="q-mx-sm q-pa-none">
    <q-item>
      <app-text-editor v-model="translatedContent" />
    </q-item>
  </q-list>
</template>

<script setup lang="ts">
  // Interface files
  import { BulletinTypes } from "@/interfaces/types/bulletin-types";
  import { CommunityNews } from "@/interfaces/models/entities/community-news";

  const { translate } = useUtilities();

  const props = defineProps({
    item: {
      type: Object as PropType<BulletinTypes>,
      required: true
    }
  });

  const newsItem = computed(() => props.item as CommunityNews);

  const translatedContent: any = computed(() => {
    return translate(newsItem.value.description, newsItem.value.meta, "description");
  });
</script>
