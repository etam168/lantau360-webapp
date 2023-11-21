<template>
  <q-table
    grid
    hide-header
    binary-state-sort
    row-key="businessId"
    no-data-label="Oops, the gallery is empty 😞"
    :rows="rows"
    :title="$t('business.expansion.businessGallery')"
    :hide-pagination="true"
  >
    <template v-slot:item="props">
      <q-card flat bordered style="width: 137px; height: 137px" class="q-ma-xs q-pa-none">
        <q-img :placeholder-src="PLACEHOLDER_THUMBNAIL" :ratio="1" :src="props.row.imagePath">
          <template v-slot:error>
            <div class="absolute-full flex flex-center bg-primary text-white">
              Cannot load image
            </div>
          </template>

          <template v-slot:loading>
            <div class="absolute-full flex flex-center bg-gray text-white">
              <q-inner-loading showing class="spinner-card row justify-center items-center">
                <q-spinner-gears size="50px" color="primary" />
              </q-inner-loading>
            </div>
          </template>
        </q-img>
      </q-card>
    </template>
  </q-table>
</template>

<script setup lang="ts">
  import { onBeforeUnmount, onMounted, PropType, ref } from "vue";
  import { BusinessImage } from "@/interfaces/businessImage";
  import { PLACEHOLDER_THUMBNAIL } from "@/constants";

  import axios from "axios";
  import eventBus from "@/utils/event-bus";

  const props = defineProps({
    rowData: {
      type: Object as PropType<BusinessImage>
    }
  });

  const rows = ref<Array<BusinessImage>>([]);

  function loadData() {
    const businessId = props.rowData.businessId;
    const url = `/BusinessImage/GetBusinessImages/${businessId}`;
    axios.get(url).then(response => {
      const rec = response.data as Array<BusinessImage>;

      // Take the first 9 and ranking > 3
      rows.value = rec
        .filter(d => d.ranking > 3)
        .slice(0, 9)
        .sort(function (x, y) {
          return x.ranking - y.ranking;
        });
    });
  }

  onMounted(() => {
    loadData();
    eventBus.on("RefreshExpandedGallery", businessId => {
      if (businessId == props.rowData.businessId) {
        loadData();
      }
    });
  });

  onBeforeUnmount(() => {
    eventBus.off("RefreshExpandedGallery");
  });
</script>
