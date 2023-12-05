<template>
  <div class="row">
    <div v-for="item in offers.slice(0, 8)" :key="item.businessId" class="col-md-3 col-6 q-pa-sm">
      <latest-offer-card :offers="item" @on-click="onItemClick" />
    </div>
  </div>
</template>
<script setup lang="ts">
  // Vue Import
  import { PropType } from "vue";

  //Custom Components
  import LatestOfferCard from "./components/latest-offer-card.vue";

  // .ts file
  import { Business } from "@/interfaces/models/entities/business";
  import { useRouter } from "vue-router";
  defineProps({
    offers: {
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
