<template>
  <q-btn-dropdown stretch flat :label="$t('searchBar.filter.title')">
    <q-list style="width: 360px" dense>
      <q-option-group
        v-model="propertyStatus"
        :options="PropertyStatuses"
        class="q-ma-md"
        color="green"
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
  import { ref } from "vue";
  import { translate } from "@/composable/use-search-bar-options";
  import { PropertyStatuses } from "@/constants";
  const propertyStatus = ref();
  const emit = defineEmits(["change"]);

  function onUpdateModel() {
    emit("change", propertyStatus);
  }
</script>
