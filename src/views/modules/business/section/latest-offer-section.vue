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
        <div class="q-pa-none q-ml-md" style="width: 260px">
          <q-card>
            <q-img :src="computeImagePath(row.imagePath)" />

            <q-card-section>
              <div class="text-overline text-orange-9">Offer 1</div>
              <div class="text-overline q-mb-xs">Offer 2</div>
            </q-card-section>

            <q-card-actions>
              <q-space />
              <q-btn flat color="primary" label="More Details" @click="navigateToDetailPage(row)" />
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

  const navigateToDetailPage = (value: any) => {
    router.push({
      name: "business-directory-item-detail",
      query: { directoryItemId: value.businessId }
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
