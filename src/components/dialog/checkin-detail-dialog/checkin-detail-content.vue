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
        <q-td class="no-border q-py-md">
          <!-- Card for Each Row -->

          <q-card flat bordered>
            <q-card-section class="q-pa-none">
              <q-bar>
                <div class="text-subtitle3">MEMO</div>
                <q-space />
                <div class="text-subtitle3">{{ dateTimeFormatter(props.row.checkInAt) }}</div>
              </q-bar>
            </q-card-section>

            <q-card-section class="ellipsis q-pa-none" style="max-width: 500px">
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
