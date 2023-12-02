<template>
  <div class="row q-col-gutter-sm">
    <div v-for="item in events.slice(0, 8)" :key="item.businessId" class="col-md-3 col-sm-4 col-6">
      <events-card :events="item" @on-click="onItemClick" />
    </div>
  </div>
</template>

<script setup lang="ts">
  // Vue Import
  import { PropType } from "vue";
  import { useRouter } from "vue-router";

  // .ts file
  import { Business } from "@/interfaces/models/entities/business";

  //Custom Components
  import EventsCard from "./components/events-card.vue";

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
