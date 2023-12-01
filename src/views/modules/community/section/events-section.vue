<template>
  <div class="row">
    <div v-for="item in events.slice(0, 8)" :key="item.businessId" class="col-md-3 col-6 q-pa-sm">
      <events-card :events="item" @on-click="onItemClick" />
    </div>
  </div>
</template>
<script setup lang="ts">
  // Vue Import
  import { PropType } from "vue";

  //Custom Components
  import EventsCard from "./cards/events-card.vue";

  // .ts file
  import { Business } from "@/interfaces/models/entities/business";
  import { useRouter } from "vue-router";
  defineProps({
    events: {
      type: Object as PropType<Business[]>,
      required: true
    }
  });

  const router = useRouter();

  const onItemClick = (value: any) => {
    router.push({
      name: "business-list",
      query: { businessId: value.businessId }
    });
  };
</script>
