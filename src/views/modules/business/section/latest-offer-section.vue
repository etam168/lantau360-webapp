<template>
  <q-card flat class="q-ma-lg">
    <q-card-actions class="q-pa-none">
      <p>Latest Offer</p>
      <q-space />
      <q-btn
        flat
        icon-right="keyboard_double_arrow_right"
        label="See All"
        @click="navigateToAllPage()"
      />
    </q-card-actions>
  </q-card>
  <q-card flat>
    <q-card-section horizontal class="q-py-none">
      <q-virtual-scroll
        ref="virtualScroll"
        class="full-width justify-center"
        :items="offers ?? []"
        :virtual-scroll-item-size="100"
        virtual-scroll-horizontal
        @virtual-scroll="onVirtualScroll"
        v-slot="{ item: row }"
      >
        <div class="q-pb-md q-px-none q-pt-none q-ml-md" style="width: 260px">
          <q-card>
            <q-img :ratio="16 / 9" :src="computeImagePath(row.imagePath)" />

            <q-card-section>
              <app-item icon="location_on" :label="row.subtitle1" />
              <app-item icon="schedule" :label="businessHours" />
            </q-card-section>

            <q-card-actions>
              <q-space />
              <q-btn
                outline
                color="primary"
                label="More Details"
                class="full-width"
                @click="navigateToDetailPage(row)"
              />
            </q-card-actions>
          </q-card>
        </div>
      </q-virtual-scroll>
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
  // Vue Import
  import { PropType, computed, ref } from "vue";
  import { Business } from "@/interfaces/models/entities/business";
  import { date } from "quasar";

  import { BLOB_URL, PLACEHOLDER_THUMBNAIL } from "@/constants";
  import { useRouter } from "vue-router";

  import AppItem from "@/components/widgets/app-item.vue";

  const virtualScrollIndex = ref(0);
  const router = useRouter();

  const props = defineProps({
    offers: {
      type: Array as PropType<Business[] | null>,
      required: true
    }
  });

  const businessHours = computed(() => {
    if (props.offers && props.offers.length > 0) {
      const datePart = date.formatDate(Date.now(), "YYYY-MM-DDT");
      const openTime = Date.parse(datePart + props.offers[0].openTime);
      const closeTime = Date.parse(datePart + props.offers[0].closeTime);

      return `${date.formatDate(openTime, "HH:mm")} - ${date.formatDate(closeTime, "HH:mm")}`;
    }
    return "";
  });

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

  const navigateToAllPage = () => {
    router.push({
      name: "business-directory-items",
      query: { directoryId: 100 }
    });
  };

  function computeImagePath(imagePath: any) {
    return imagePath ? `${BLOB_URL}/${imagePath}` : PLACEHOLDER_THUMBNAIL;
  }

  function onVirtualScroll(details: any) {
    virtualScrollIndex.value = details.index;
  }
</script>
