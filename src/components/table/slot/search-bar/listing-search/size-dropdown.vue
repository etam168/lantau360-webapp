<template>
  <q-btn-dropdown stretch flat :label="$t('searchBar.search.size')">
    <q-item-label header class="q-pb-none">{{ $t("searchBar.size.title") }}</q-item-label>

    <q-list
      bordered
      class="q-mt-sm q-mx-md q-mb-md q-pa-md row justify-evenly"
      style="width: 480px"
    >
      <q-badge outline color="primary" class="text-subtitle1 justify-center" style="width: 40%">
        {{ sizeModel.min * 100 }}
      </q-badge>

      <q-badge outline color="primary" class="text-subtitle1 justify-center" style="width: 40%">
        {{ sizeModel.max * 100 }}
      </q-badge>

      <q-range
        v-model="sizeModel"
        class="q-my-sm q-pr-md"
        color="primary"
        markers
        snap
        :marker-labels="searchBarOptions?.size"
        :min="minSize"
        :max="maxSize"
        :step="2.5"
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
        </template></q-range
      >
    </q-list>
  </q-btn-dropdown>
</template>

<script setup lang="ts">
  // Vue Import
  import { ref, inject } from "vue";
  import { SearchBarOptions, SizeRange } from "@/interfaces/search-bar-options";

  const emit = defineEmits(["change"]);
  const searchBarOptions = inject<SearchBarOptions>("searchOptions");
  const [minSize, maxSize] = [0, 20];

  const sizeModel = ref({
    min: 0,
    max: 25
  });

  function onUpdateModel(val: any) {
    const output = ref<SizeRange>({ min: 0, max: null });
    output.value.min = val.min * 100;
    output.value.max = val.max == maxSize ? null : val.max * 100;

    emit("change", output);
  }
</script>
