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
  import { CommunityEventView } from "@/interfaces/models/views/community-event-view";

  const { translate } = useUtilities();

  const props = defineProps({
    item: {
      type: Object as PropType<BulletinTypes>,
      required: true
    }
  });

  const eventItem = computed(() => props.item as CommunityEventView);

  const translatedContent: any = computed(() => {
    return translate(eventItem.value.description, eventItem.value.meta, "description");
  });
</script>
