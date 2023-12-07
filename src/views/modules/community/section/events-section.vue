<template>
  <div class="row q-col-gutter-sm">
    <div v-for="item in events" :key="item.communityEventId" class="col-md-3 col-sm-4 col-6">
      <events-card :events="item" @on-click="handleDialog" />
    </div>
  </div>
</template>

<script setup lang="ts">
  // Vue Import
  import { PropType, defineAsyncComponent } from "vue";
  import { useRouter } from "vue-router";
  import { useQuasar } from "quasar";

  // .ts file
  import { CommunityEvent } from "@/interfaces/models/entities/communityEvent";

  //Custom Components
  import EventsCard from "./components/events-card.vue";

  defineProps({
    events: {
      type: Object as PropType<CommunityEvent[]>,
      required: true
    }
  });

  const router = useRouter();
  const $q = useQuasar();

  const onItemClick = (value: any) => {
    router.push({
      name: "community-event-list",
      query: { communityEventId: value.communityEventId }
    });
  };

  onItemClick;

  function handleDialog(item: any) {
    $q.dialog({
      component: defineAsyncComponent(() => import("./community-event-detail-dialog.vue")),
      componentProps: {
        query: { communityEventId: item.communityEventId }
      }
    });
  }
</script>
