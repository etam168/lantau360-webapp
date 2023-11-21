<template>
  <q-btn-dropdown stretch flat :label="$t('searchBar.search.price')">
    <q-item-label header class="q-pb-none">{{ $t("searchBar.price.title") }}</q-item-label>

    <q-list
      bordered
      class="q-mt-sm q-mx-md q-mb-md q-pa-md row justify-evenly"
      style="width: 480px"
    >
      <q-badge outline color="primary" class="text-subtitle1 justify-center" style="width: 40%">
        {{ priceModel.min + "M" }}
      </q-badge>

      <q-badge outline color="primary" class="text-subtitle1 justify-center" style="width: 40%">
        {{ priceModel.max + "M" }}
      </q-badge>

      <q-range
        v-model="priceModel"
        class="q-my-sm q-pr-sm"
        color="primary"
        markers
        snap
        :marker-labels="searchOptions?.price"
        :min="minPrice"
        :max="maxPrice"
        :step="2"
        @update:model-value="onUpdateModel"
      >
        <template v-slot:marker-label-group="{ markerList }">
          <div
            v-for="marker in markerList"
            :key="marker.index"
            :class="[`text-deep-orange-${2 + Math.ceil(marker.value / 2)}`, marker.classes]"
            :style="marker.style"
          >
            <span>{{ $t(marker.label) }}</span>
          </div>
        </template>
      </q-range>
    </q-list>
  </q-btn-dropdown>
</template>

<script setup lang="ts">
  // Vue Import
  import { ref, inject } from "vue";
  import { SearchBarOptions, PriceRange } from "@/interfaces/search-bar-options";

  const emit = defineEmits(["change"]);
  const searchOptions = inject<SearchBarOptions>("searchOptions");
  const [minPrice, maxPrice] = [0, 20];

  const priceModel = ref({
    min: 0,
    max: 20
  });

  function onUpdateModel(val: any) {
    const output = ref<PriceRange>({ min: 0, max: null });
    output.value.min = val.min * 1000000;
    output.value.max = val.max == maxPrice ? null : val.max * 1000000;

    emit("change", output);
  }
</script>
