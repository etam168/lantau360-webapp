<template>
  <q-card flat class="my-card q-ma-lg">
    <q-card-actions class="q-pa-none">
      <p class="q-mb-none">Latest Offer</p>
      <q-space />
      <q-btn
        flat
        icon-right="keyboard_double_arrow_right"
        label="See All"
        class="text-capitalize q-pa-none"
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
        <div class="q-pa-none" style="width: 260px" @click="onItemClick(row)">
          <q-card class="my-card" flat bordered>
            <q-img class="q-ml-md" :src="computeImagePath(row.imagePath)" />

            <q-card-section>
              <div class="text-overline text-orange-9">Offer 1</div>
              <div class="text-overline q-mb-xs">Offer 2</div>
            </q-card-section>

            <q-card-actions>
              <q-space />
              <q-btn flat color="primary" label="More Details" />
            </q-card-actions>
          </q-card>
        </div>
      </q-virtual-scroll>
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
  // Vue Import
  import { PropType, ref } from "vue";
  import { Business } from "@/interfaces/models/entities/business";

  import { BLOB_URL, PLACEHOLDER_THUMBNAIL } from "@/constants";
  import { useRouter } from "vue-router";

  const virtualScrollIndex = ref(0);
  const router = useRouter();
  defineProps({
    offers: {
      type: Array as PropType<Business[] | null>,
      required: true
    }
  });

  const onItemClick = (value: any) => {
    router.push({
      name: "business-directory-item-detail",
      query: { directoryItemId: value.businessId }
    });
  };

  function computeImagePath(imagePath: any) {
    return imagePath ? `${BLOB_URL}/${imagePath}` : PLACEHOLDER_THUMBNAIL;
  }

  function onVirtualScroll(details: any) {
    virtualScrollIndex.value = details.index;
  }
</script>
