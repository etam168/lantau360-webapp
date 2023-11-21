<!-- AmenityFilter.vue -->
<template>
  <q-select
    v-model="selectedAmenities"
    hint="Max 3 selections"
    label="Filter by amenities"
    max-values="3"
    style="min-width: 392px"
    clearable
    counter
    emit-value
    filled
    multiple
    :options="amenityOptions"
    @update:model-value="onUpdateModel"
  >
    <template v-slot:option="scope">
      <q-item v-bind="scope.itemProps">
        <q-item-section dense>
          <q-item-label>{{ scope.opt.label }}</q-item-label>
        </q-item-section>

        <q-item-section dense side>
          <q-item-label caption
            ><q-badge class="bg-green-1 text-primary">{{ scope.opt.value }}</q-badge></q-item-label
          >
        </q-item-section>
      </q-item>
    </template>

    <template v-slot:selected-item="scope">
      <q-chip
        dense
        @remove="scope.removeAtIndex(scope.index)"
        :tabindex="scope.tabindex"
        color="primary"
        text-color="secondary"
        class="q-ma-xs"
      >
        {{ scope.opt }}
      </q-chip>
    </template>

    <template v-slot:after>
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
    </template>
  </q-select>
</template>

<script setup lang="ts">
  // Vue Import
  import { PropType, ref, computed } from "vue";

  // .ts files
  import { Amenity } from "@/interfaces/models/entities/amenity";

  const props = defineProps({
    amenities: {
      type: Array as PropType<Array<Amenity>>,
      default: () => [],
      required: false
    }
  });

  const emit = defineEmits<{
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    (event: "on-amenity", props: any): void;
  }>();

  const amenityOptions = computed(() =>
    props.amenities.map(group => {
      return {
        value: group.amenityId,
        label: group.amenityName
      };
    })
  );

  const selectedAmenities = ref([]);
  const isExactMatch = ref(false);

  function onUpdateModel() {
    if (selectedAmenities.value === null) {
      selectedAmenities.value = [];
    }
    // Emit the event only if val is an array with values
    emit("on-amenity", { ids: selectedAmenities.value, matchAll: isExactMatch.value });
  }
</script>
