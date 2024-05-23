<template>
  <q-card
    flat
    class="q-ma-md"
    :style="{
      height: $q.screen.gt.xs ? '370px' : 'auto'
    }"
  >
    <q-card-section
      class="q-pa-none"
      :class="{ 'row no-wrap': $q.screen.gt.xs, column: !$q.screen.gt.xs }"
    >
      <map-component :item="item" />

      <q-list
        dense
        style="max-width: 250px; flex: 1"
        :class="$q.screen.gt.xs ? 'q-pa-md' : 'q-px-none q-py-md'"
      >
        <contact-content :item="item" />

        <q-card-actions class="q-mt-xs q-pa-none">
          <app-button
            class="full-width"
            :label="$t('home.tabItems.checkin')"
            color="primary"
            type="submit"
            size="md"
            @click="checkIn()"
          />
        </q-card-actions>
      </q-list>
    </q-card-section>
  </q-card>
</template>
<script setup lang="ts">
  // Interface files
  import { CategoryTypes } from "@/interfaces/types/category-types";

  //UI Component
  import ContactContent from "../../common/contact-content.vue";
  import MapComponent from "@/components/dialog/renderer/common/map-component.vue";

  const props = defineProps({
    item: {
      type: Object as PropType<CategoryTypes>,
      required: true
    }
  });

  const $q = useQuasar();

  function checkIn() {
    $q.dialog({
      component: defineAsyncComponent(() => import("@/components/dialog/do-checkin-dialog.vue")),
      componentProps: {
        item: props.item
      }
    });
  }
</script>
