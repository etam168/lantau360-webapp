<template>
  <q-list padding class="q-mx-sm q-pa-none">
    <q-item>
      <div v-html="translate(noticeItem.description, noticeItem.meta, 'description')"></div>
    </q-item>
  </q-list>
</template>

<script setup lang="ts">
  // Interface and Type
  import { BulletinTypes } from "@/interfaces/types/bulletin-types";
  import { CommunityNotice } from "@/interfaces/models/entities/community-notice";

  const { translate } = useUtilities();

  const props = defineProps({
    item: {
      type: Object as PropType<BulletinTypes>,
      required: true
    }
  });

  const noticeItem = computed(() => {
    return props.item as CommunityNotice;
  });
</script>
