<template>
  <q-card flat>
    <q-card-section>
      <q-item>
        <q-item-section top>
          <q-item-label class="text-h5 text-weight-medium text-black" lines="1">
            {{ props.rowData.siteName }}
          </q-item-label>
          <q-item-label>
            {{ props.rowData.subtitle1 }}
          </q-item-label>
        </q-item-section>
      </q-item>
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
  // Vue Import
  import { PropType } from "vue";

  // Custom Components

  const props = defineProps({
    rowData: {
      type: Object as PropType<any>,
      required: true
    }
  });
</script>
