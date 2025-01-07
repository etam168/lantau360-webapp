<template>
  <q-table
    v-bind="$attrs"
    flat
    hide-pagination
    hide-header
    separator="none"
    row-key="checkInAt"
    class="q-mx-auto q-mt-sm"
    style="max-width: 560px"
    :rows="getCheckinRows(item)"
    :rows-per-page-options="[0]"
  >
    <template v-slot:body="props">
      <q-tr :props="props">
        <q-td class="q-py-sm">
          <!-- Card for Each Row -->
          <q-card flat class="q-pa-none">
            <q-bar dense class="bg-primary text-white">
              <q-item-label>MEMO</q-item-label>
              <q-space />
              <div class="text-subtitle3">{{ dateTimeFormatter(props.row.checkInAt) }}</div>
            </q-bar>

            <q-card-section class="q-pa-none">
              <vee-input
                readonly
                hide-bottom-space
                v-model="props.row.description"
                :name="`description_${props.row.checkInAt}`"
                type="textarea"
              />
            </q-card-section>
          </q-card>
        </q-td>
      </q-tr>
    </template>
  </q-table>
</template>

<script setup lang="ts">
  // Third party imports
  import { QTable } from "quasar";

  const { item } = defineProps<{
    item: { checkInfo: Array<{ checkInAt: string; description: string }> };
  }>();

  const { dateTimeFormatter } = useUtilities();

  const getCheckinRows = (item: any) => {
    return item.checkInfo || [];
  };
</script>
