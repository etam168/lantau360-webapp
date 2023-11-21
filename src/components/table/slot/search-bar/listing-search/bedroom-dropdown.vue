<template>
  <q-btn-dropdown stretch flat :label="$t('searchBar.search.bedrooms')">
    <q-item-label header>{{ $t("searchBar.bedroom.title") }}</q-item-label>

    <q-list
      bordered
      class="q-mt-sm q-mx-md q-mb-md q-pa-md row justify-evenly"
      style="width: 480px"
    >
      <q-badge outline color="primary" class="text-subtitle1 justify-center" style="width: 40%">
        {{ bedModel.min == 0 ? "Studio" : bedModel.min + "Bed" }}
      </q-badge>

      <q-badge outline color="primary" class="text-subtitle1 justify-center" style="width: 40%">
        {{ bedModel.max == 0 ? "Studio" : bedModel.max + "Bed" }}
      </q-badge>

      <q-range
        v-model="bedModel"
        class="q-my-sm q-pr-sm"
        color="primary"
        markers
        snap
        :marker-labels="searchOptions?.bedrooms"
        :min="minBed"
        :max="maxBed"
        :step="1"
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

  // .ts files
  import { SearchBarOptions } from "@/interfaces/search-bar-options";

  const searchOptions = inject<SearchBarOptions>("searchOptions");
  // const bed = ref([]);

  const [minBed, maxBed] = [0, 5];

  const bedModel = ref({
    min: 0,
    max: 5
  });
  const emit = defineEmits(["change"]);

  function onUpdateModel() {
    emit("change", bedModel);
  }
</script>
