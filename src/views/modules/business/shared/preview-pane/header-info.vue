<template>
  <q-card flat>
    <q-card-section>
      <q-item>
        <q-item-section top>
          <q-item-label class="text-h5 text-weight-medium text-black" lines="1">
            {{ props.rowData.businessName }}
          </q-item-label>
          <q-item-label>
            {{ props.rowData.subtitle1 }}
          </q-item-label>
        </q-item-section>
      </q-item>

      <app-item icon="schedule" :label="businessHours" />
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
  // Vue Import
  import { computed, PropType } from "vue";
  import { date } from "quasar";

  // Custom Components
  import AppItem from "@/components/widgets/app-item.vue";

  const props = defineProps({
    rowData: {
      type: Object as PropType<any>,
      required: true
    }
  });

  const businessHours = computed(() => {
    const datePart = date.formatDate(Date.now(), "YYYY-MM-DDT");
    const openTime = Date.parse(datePart + props.rowData.openTime);
    const closeTime = Date.parse(datePart + props.rowData.closeTime);

    return `${date.formatDate(openTime, "HH:mm")} - ${date.formatDate(closeTime, "HH:mm")}`;
  });
</script>
