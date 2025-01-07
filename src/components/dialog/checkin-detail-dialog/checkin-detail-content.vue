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
          <q-list bordered separator>
            <q-item clickable>
              <q-item-section avatar>
                <q-icon :name="fasCalendarDays" size="16px" class="q-mr-sm" />
              </q-item-section>

              <q-item-section>
                <q-item-label> {{ dateTimeFormatter(props.row.checkInAt) }}</q-item-label>
                <q-item-label caption lines="1">{{ props.row.description }}</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
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
