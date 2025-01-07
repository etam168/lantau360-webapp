<template>
  <q-table
    v-bind="$attrs"
    flat
    dense
    hide-pagination
    hide-header
    row-key="checkInAt"
    class="q-mx-auto"
    style="max-width: 560px"
    :rows="getCheckinRows(item)"
    :rows-per-page-options="[0]"
  >
    <template v-slot:body="props">
      <q-tr :props="props">
        <q-td class="no-border q-pa-none">
          <!-- Card for Each Row -->

          <q-card class="my-card" flat bordered>
            <q-card-actions class="justify-between q-py-sm q-px-md">
              <div class="text-subtitle3 text-left">MEMO</div>
              <div class="text-subtitle3 text-right">
                {{ dateTimeFormatter(props.row.checkInAt) }}
              </div>
            </q-card-actions>

            <q-separator inset />
            <q-card-section class="ellipsis" style="max-width: 500px">
              {{ props.row.description }}
            </q-card-section>
          </q-card>
        </q-td>
      </q-tr>
    </template>
  </q-table>
</template>

<script setup lang="ts">
  // Third party imports
  import { fasCalendarDays } from "@quasar/extras/fontawesome-v6";
  import { QTable } from "quasar";

  const { item } = defineProps<{
    item: { checkInfo: Array<{ checkInAt: string; description: string }> };
  }>();

  const { dateTimeFormatter } = useUtilities();

  const getCheckinRows = (item: any) => {
    return item.checkInfo || [];
  };
</script>

<style scoped>
  .date-section {
    font-size: 14px;
    font-weight: bold;
    color: #333;
  }

  .q-card {
    padding: 12px;
  }
</style>
