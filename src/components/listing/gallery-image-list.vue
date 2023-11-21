<template>
  <q-table
    class="bg-yellow"
    grid
    hide-header
    binary-state-sort
    row-key="propertyListingId"
    no-data-label="Oops, the gallery iss empty 😞"
    :rows="rows"
    :title="$t('propertyListing.expansion.propertyGallery')"
    :hide-pagination="true"
  >
    <template v-slot:item="props">
      <ImageCard
        :placeholder-src="PLACEHOLDER_THUMBNAIL"
        :img-src="`https://insightpropertystorage.blob.core.windows.net/realty-hub-dev/${props.row.imagePath}`"
        :isDelete="isDelete"
      />
    </template>
  </q-table>
</template>

<script setup lang="ts">
  // Vue Import
  import { ref, onMounted, onBeforeUnmount, Ref, inject } from "vue";

  // 3rd Party Import
  import axios from "axios";

  // .ts files
  import eventBus from "@/utils/event-bus";
  import { PLACEHOLDER_THUMBNAIL } from "@/constants";
  import { PropertyListing } from "@/interfaces/models/entities/property-listing";
  import { PropertyListingImage } from "@/interfaces/models/entities/propertyListingImage";

  // Custom Components
  import ImageCard from "@/components/listing/image-card.vue";

  const rows = ref<Array<PropertyListingImage>>([]);
  const propertyListingInput = inject("propertyListingInput") as Ref<PropertyListing>;
  const isDelete = ref(true);

  function loadData() {
    const propertyListingId = propertyListingInput.value.propertyListingId;
    const url = `/propertyListingImage/GetpropertyImages/${propertyListingId}`;

    axios.get(url).then(response => {
      const rec = response.data as Array<PropertyListingImage>;
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
    eventBus.on("RefreshExpandedGallery", propertyListingId => {
      if (propertyListingId == propertyListingInput.value.propertyListingId) {
        loadData();
      }
    });
  });

  onBeforeUnmount(() => {
    eventBus.off("RefreshExpandedGallery");
  });
</script>
