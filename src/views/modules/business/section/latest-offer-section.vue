<template>
  <q-list>
    <q-item-label header class="q-pa-none">Latest Offer</q-item-label>
    <q-item dense class="q-pa-none">
      <q-item-section>
        <q-item-label>
          <q-card-section class="q-pa-none">
            <q-card-section horizontal class="wrap" style="flex-wrap: wrap">
              <div v-for="row in offers" :key="row.businessId" class="col-6 q-pa-sm">
                <q-card class="my-card"
                  ><q-img :ratio="16 / 9" :src="computeImagePath(row.imagePath)" />
                  <q-card-section class="q-pa-sm">
                    <app-item dense icon="location_on" :label="row.subtitle1" />
                    <app-item dense icon="schedule" :label="computeBusinessHours(row)" />
                  </q-card-section>

                  <q-card-actions>
                    <q-space />
                    <q-btn
                      outline
                      dense
                      color="primary"
                      label="More Details"
                      class="full-width"
                      @click="navigateToDetailPage(row)"
                    /> </q-card-actions
                ></q-card>
              </div>
            </q-card-section>
          </q-card-section>
        </q-item-label>
      </q-item-section>
    </q-item>
  </q-list>
</template>

<script setup lang="ts">
  // Vue Import
  import { PropType } from "vue";
  import { Business } from "@/interfaces/models/entities/business";
  import { date } from "quasar";

  import { PLACEHOLDER_THUMBNAIL } from "@/constants";
  import { useRouter } from "vue-router";

  import AppItem from "@/components/widgets/app-item.vue";

  // const virtualScrollIndex = ref(0);
  const router = useRouter();

  defineProps({
    offers: {
      type: Array as PropType<Business[] | null>,
      required: true
    }
  });

  const computeBusinessHours = (row: Business) => {
    const datePart = date.formatDate(Date.now(), "YYYY-MM-DDT");

    // Check if openTime and closeTime are undefined or null, provide default values
    const openTime = row.openTime
      ? Date.parse(datePart + row.openTime)
      : Date.parse(datePart + "09:00");
    const closeTime = row.closeTime
      ? Date.parse(datePart + row.closeTime)
      : Date.parse(datePart + "17:00");

    return `${date.formatDate(openTime, "HH:mm")} - ${date.formatDate(closeTime, "HH:mm")}`;
  };

  // const navigateToDetailPage = (value: any) => {
  //   router.push({
  //     name: "business-list",
  //     query: { directoryItemId: value.businessId }
  //   });
  // };

  const navigateToDetailPage = (item: Business) => {
    router.push({
      name: "business-detail",
      query: { businessId: item.businessId }
    });
  };

  function computeImagePath(imagePath: any) {
    return imagePath ? `${imagePath}` : PLACEHOLDER_THUMBNAIL;
  }

  // function onVirtualScroll(details: any) {
  //   virtualScrollIndex.value = details.index;
  // }
</script>
