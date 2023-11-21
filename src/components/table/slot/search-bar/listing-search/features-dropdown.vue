<template>
  <q-btn-dropdown stretch flat :label="$t('searchBar.search.features')">
    <q-list style="width: 360px" dense>
      <q-item-label header
        >{{ $t("searchBar.features.title") }}
        <q-toggle
          dense
          v-model="isExactMatch"
          checked-icon="check"
          color="green"
          unchecked-icon="clear"
          class="text-caption"
          :label="$t('action.matchAll')"
          @update:model-value="onUpdateModel"
        />
      </q-item-label>
      <q-separator />

      <q-option-group
        v-model="features"
        :options="searchOptions?.features"
        class="q-ma-md"
        color="green"
        type="checkbox"
        @update:model-value="onUpdateModel"
      >
        <template #label="opt">
          <div class="row items-center">
            <span>{{ translate(opt.label, opt.meta) }}</span>
          </div>
        </template>
      </q-option-group>
    </q-list>
  </q-btn-dropdown>
</template>

<script setup lang="ts">
  // Vue Import
  import { ref, inject } from "vue";

  // .ts files
  import { SearchBarOptions } from "@/interfaces/search-bar-options";
  import { translate } from "@/composable/use-search-bar-options";

  const searchOptions = inject<SearchBarOptions>("searchOptions");
  const features = ref([]);
  const isExactMatch = ref(false);
  const emit = defineEmits(["change"]);

  function onUpdateModel() {
    emit("change", { ids: features, matchAll: isExactMatch.value });
  }
</script>
