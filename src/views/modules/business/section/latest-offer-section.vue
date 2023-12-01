<template>
  <div class="row">
    <latest-offer-card
      class="col-md-3 col-6"
      v-for="item in offers.slice(0, 8)"
      :key="item.businessId"
      :offers="item"
      @on-click="onItemClick"
    />
  </div>
</template>
<script setup lang="ts">
  // Vue Import
  import { PropType } from "vue";

  //Custom Components
  import LatestOfferCard from "./latest-offer-card.vue";

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
