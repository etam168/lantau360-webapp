<template>
  <q-list>
    <q-item dense class="q-pa-none">
      <q-item-section>
        <q-item-label>
          <template v-if="listingMode === 3">
            <q-chip dense text-color="white" class="bg-primary"> Rent </q-chip>
            <q-chip dense text-color="white" class="bg-warning"> Sell </q-chip>
          </template>
          <template v-else>
            <q-chip
              dense
              text-color="white"
              v-if="listingMode != 0"
              :class="getChipColorClass(listingMode)"
            >
              {{ getChipText(listingMode) }}
            </q-chip>
          </template>
        </q-item-label>
      </q-item-section>
    </q-item>
  </q-list>
</template>

<script setup lang="ts">
  defineProps({
    listingMode: {
      type: Number,
      required: true
    }
  });

  const getChipColorClass = (listingMode: any): string => {
    if (listingMode === 1) {
      return "bg-green-9";
    } else if (listingMode === 2) {
      return "bg-warning";
    }
    return "";
  };

  const getChipText = (listingMode: any): string => {
    if (listingMode === 1) {
      return "Rent";
    } else if (listingMode === 2) {
      return "Sell";
    }
    return "";
  };
</script>
