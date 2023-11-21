<template>
  <q-toolbar class="q-gutter-x-lg">
    <q-space />
    <q-input
      debounce="400"
      v-model="filter"
      :placeholder="$t('action.search')"
      style="min-width: 360px; height: 80px"
      @keyup.enter="handleFilter"
      @click:append="handleFilter"
    >
      <template v-slot:append>
        <q-icon name="search" @click="handleFilter" class="cursor-pointer" />
      </template>
    </q-input>

    <amenities-filter :amenities="searchBarData" @on-amenity="handleAmenityChange" />
  </q-toolbar>
</template>

<script setup lang="ts">
  // Vue Import
  import { PropType, ref } from "vue";

  // .ts files
  import { Amenity } from "@/interfaces/models/entities/amenity";

  // Custom Components
  import AmenitiesFilter from "./amenity-filter.vue";

  defineProps({
    toolTipCreate: String,
    buttonOption: {
      type: Number,
      default: 1,
      required: false
    },
    searchBarData: {
      type: Array as PropType<Array<Amenity>>,
      default: () => [],
      required: false
    }
  });

  const emit = defineEmits<{
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    (event: "on-search", props: any): void;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    (event: "on-amenity", props: any): void;
  }>();

  // const { isNthBitSet } = useUtilities();
  const filter = ref("");

  function handleFilter() {
    emit("on-search", filter.value);
  }

  function handleAmenityChange(props: any) {
    emit("on-amenity", props);
  }
</script>
