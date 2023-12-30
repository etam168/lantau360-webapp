<template>
  <q-list padding class="q-mx-sm q-pa-none">
    <q-item>
      <app-text-editor v-model="translatedContent" />
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

  const translatedContent: any = computed(() => {
    return translate(noticeItem.value.description, noticeItem.value.meta, "description");
  });
  const noticeItem = computed(() => {
    return props.item as CommunityNotice;
  });
</script>
