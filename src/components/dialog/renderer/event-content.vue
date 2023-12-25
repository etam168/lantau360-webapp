<template>
  <q-list padding class="q-mx-sm q-pa-none">
    <q-item>
      <div v-html="translate(eventItem.description, eventItem.meta, 'description')"></div>
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

  const eventItem = computed(() => {
    return props.item as CommunityEvent;
  });
</script>
