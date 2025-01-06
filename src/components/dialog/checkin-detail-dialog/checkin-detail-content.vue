<template>
  <div style="width: 520px; margin:auto">
    <q-table
      v-bind="$attrs"
      flat
      dense
      hide-pagination
      hide-header
      row-key="checkInAt"
      class="q-mx-md q-mt-md"
      :rows="getCheckinRows(item)"
      :rows-per-page-options="[0]"
    >
      <template v-slot:body="props">
        <q-tr :props="props">
          <q-td>
            <div class="column-layout">
              <div class="date-section">
                {{ dateTimeFormatter(props.row.checkInAt) }}
              </div>
              <div>
                <vee-input
                  v-model="props.row.description"
                  :name="`description_${props.row.checkInAt}`"
                  label="Note"
                  type="textarea"
                  :disable="true"
                />
              </div>
            </div>
          </q-td>
        </q-tr>
      </template>
    </q-table>
  </div>
</template>

<script setup lang="ts">
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
  .column-layout {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .date-section {
    font-size: 14px;
    font-weight: bold;
    color: #333;
  }
</style>
