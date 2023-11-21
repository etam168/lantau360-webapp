<template>
  <q-btn-dropdown stretch flat :label="$t('searchBar.search.location')">
    <q-list bordered class="q-ma-md" style="width: 700px">
      <q-item-label header>{{ $t("searchBar.location.title") }}</q-item-label>
      <q-expansion-item
        v-for="territory in territoriesList"
        :key="territory.value"
        :default-opened="territory.expanded"
        expand-separator
      >
        <template v-slot:header>
          <q-item-section avatar>
            <q-avatar>
              <q-badge rounded color="red" label="1" />
            </q-avatar>
          </q-item-section>

          <q-item-section>
            <q-item-label>{{
              translate(territory.label, territory.meta)
            }}</q-item-label></q-item-section
          >
        </template>

        <q-card>
          <q-item>
            <q-item-section
              ><q-option-group
                v-model="selectedId"
                :options="territory.option"
                color="green"
                type="checkbox"
                @update:model-value="locationChange"
              >
                <template v-slot:label="opt">
                  <div class="row items-center">
                    <span>{{ translate(opt.label, opt.meta) }}</span>
                  </div>
                </template>
              </q-option-group></q-item-section
            >

            <q-item-section top
              ><q-option-group
                v-model="selectedId"
                :options="territory.option1"
                color="green"
                type="checkbox"
                @update:model-value="locationChange"
              >
                <template v-slot:label="opt">
                  <div class="row items-center">
                    <span>{{ translate(opt.label, opt.meta) }}</span>
                  </div>
                </template>
              </q-option-group></q-item-section
            >
          </q-item>
        </q-card>
      </q-expansion-item>
    </q-list>
  </q-btn-dropdown>
</template>

<script setup lang="ts">
  // Vue Import
  import { ref, inject } from "vue";
  import { SearchBarOptions } from "@/interfaces/search-bar-options";
  import { translate } from "@/composable/use-search-bar-options";

  const emit = defineEmits(["selectedlocation"]);

  const searchBarOptionData = inject<SearchBarOptions>("searchOptions");
  const territoriesList = ref(searchBarOptionData?.territories);

  const selectedId = ref([]);
  function locationChange(val: any) {
    emit("selectedlocation", val);
  }
</script>
