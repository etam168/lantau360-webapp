<template>
  <q-dialog
    ref="dialogRef"
    transition-show="slide-up"
    transition-hide="slide-down"
    @update:model-value="updateDialogState"
    :model-value="isDialogVisible"
    maximized
  >
    <q-layout view="lHh lpr lFf" container style="max-width: 1024px; background-color: #f6f6f6">
      <q-header class="bg-transparent text-dark">
        <app-dialog-title>{{ dialogTitle }}</app-dialog-title>
      </q-header>

      <q-page-container>
        <q-page>
          <atm-renderer v-if="renderer === RENDERER.ATM" :item="item" />
          <business-renderer v-else-if="renderer === RENDERER.BUSINESS" :item="item" />
          <daytrip-renderer v-else-if="renderer === RENDERER.DAYTRIP" :item="item" />
          <emergency-renderer v-else-if="renderer === RENDERER.EMERGENCY" :item="item" />
          <property-renderer v-else-if="renderer === RENDERER.PROPERTY" :item="item" />
          <posting-renderer v-else-if="renderer === RENDERER.POSTING" :item="item" />
          <restaurant-renderer v-else-if="renderer === RENDERER.RESTAURANT" :item="item" />
          <site-renderer v-else-if="renderer === RENDERER.SITE" :item="item" />
          <taxi-renderer v-else-if="renderer === RENDERER.TAXI" :item="item" />
          <timetable-renderer v-else-if="renderer === RENDERER.TIMETABLE" :item="item" />
          <tuition-renderer v-else-if="renderer === RENDERER.TUITION" :item="item" />
        </q-page>
      </q-page-container>
    </q-layout>
  </q-dialog>
</template>

<script setup lang="ts">
  import { useDialogPluginComponent } from "quasar";

  // Interface files
  import { CategoryTypes } from "@/interfaces/types/category-types";

  // .ts files
  import { RENDERER, TEMPLATE } from "@/constants";

  // Custom Components
  import AtmRenderer from "@/components/dialog/renderer/atm-renderer.vue";
  import BusinessRenderer from "@/components/dialog/renderer/business-renderer.vue";
  import DaytripRenderer from "@/components/dialog/renderer/daytrip-renderer.vue";
  import EmergencyRenderer from "@/components/dialog/renderer/emergency-renderer.vue";
  import PostingRenderer from "@/components/dialog/renderer/posting-renderer.vue";
  import PropertyRenderer from "@/components/dialog/renderer/property-renderer.vue";
  import RestaurantRenderer from "@/components/dialog/renderer/restaurant-renderer.vue";
  import SiteRenderer from "@/components/dialog/renderer/site-renderer.vue";
  import TaxiRenderer from "@/components/dialog/renderer/taxi-renderer.vue";
  import TimetableRenderer from "@/components/dialog/renderer/timetable-renderer.vue";
  import TuitionRenderer from "@/components/dialog/renderer/tuition-renderer.vue";

  const props = defineProps({
    item: {
      type: Object as PropType<CategoryTypes>,
      required: true
    }
  });

  const { isBusinessView, isPostingView, isSiteView, eventBus, translate } = useUtilities();
  const { dialogRef } = useDialogPluginComponent();
  const isDialogVisible = ref();

  const dialogTitle = computed(() => {
    if (isSiteView(props.item)) {
      return translate(props.item.siteName, props.item.meta, "siteName");
    } else if (isBusinessView(props.item)) {
      return translate(props.item.businessName, props.item.meta, "businessName");
    } else if (isPostingView(props.item)) {
      return "Posting";
    }
  });

  const renderer = computed(() => {
    if (props.item.directoryTemplate == TEMPLATE.ATM.value) {
      return RENDERER.ATM;
    } else if (props.item.directoryTemplate == TEMPLATE.TIMETABLE.value) {
      return RENDERER.TIMETABLE;
    } else if (props.item.directoryTemplate == TEMPLATE.TAXI.value) {
      return RENDERER.TAXI;
    } else if (props.item.directoryTemplate == TEMPLATE.RESTAURANT.value) {
      return RENDERER.RESTAURANT;
    } else if (props.item.directoryTemplate == TEMPLATE.DAYTRIP.value) {
      return RENDERER.DAYTRIP;
    } else if (props.item.directoryTemplate == TEMPLATE.EMERGENCY.value) {
      return RENDERER.EMERGENCY;
    } else if (props.item.directoryTemplate == TEMPLATE.PROPERTY.value) {
      return RENDERER.EMERGENCY;
    } else if (props.item.directoryTemplate == TEMPLATE.TUITION.value) {
      return RENDERER.EMERGENCY;
    } else if (isSiteView(props.item)) {
      return RENDERER.SITE;
    } else if (isBusinessView(props.item)) {
      return RENDERER.BUSINESS;
    } else if (isPostingView(props.item)) {
      return RENDERER.POSTING;
    }

    return "";
  });

  onMounted(() => {
    eventBus.on("CategoryDetailDialog", () => {
      isDialogVisible.value = false;
    });
  });

  function updateDialogState(status: any) {
    isDialogVisible.value = status;
    eventBus.emit("DialogStatus", status, "CategoryDetailDialog");
  }
</script>
