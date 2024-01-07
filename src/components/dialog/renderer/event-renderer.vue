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
  import { CommunityEvent } from "@/interfaces/models/entities/community-event";

  const { translate } = useUtilities();

  const props = defineProps({
    item: {
      type: Object as PropType<BulletinTypes>,
      required: true
    }
  });

  const eventItem = computed(() => props.item as CommunityEvent);

  const translatedContent: any = computed(() => {
    return translate(eventItem.value.description, eventItem.value.meta, "description");
  });
</script>
