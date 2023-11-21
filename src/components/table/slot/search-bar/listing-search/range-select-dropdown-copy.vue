<template>
  <q-list dense>
    <q-item class="q-mb-none" style="margin-bottom: -4px">
      <q-item-section>
        <q-item-label class="text-weight-bold">{{ formateTitle }}</q-item-label>
      </q-item-section>
    </q-item>

    <q-item>
      <q-item-section class="q-pl-sm q-my-none" colspan="2">
        <q-range
          v-model="secondModel"
          color="brown"
          thumb-color="primary"
          label-color="black"
          markers
          snap
          :min="0"
          :max="5"
          :marker-labels="markerLabels"
          @update:model-value="onUpdateModel"
        >
          <template v-slot:marker-label-group="scope">
            <div
              v-for="(marker, index) in getExtendedMarkerList(scope.markerList)"
              :key="index"
              :class="[marker.classes]"
              :style="marker.style"
              @click="secondModel = marker.value"
            >
              {{ marker.label }}
            </div>
          </template>
        </q-range>
      </q-item-section>
    </q-item>
  </q-list>
</template>

<script setup lang="ts">
  // Vue Import
  import { computed } from "vue";

  import i18n from "@/plugins/i18n/i18n";

  const props = defineProps({
    options: {
      type: Object,
      required: true
    },
    rangeValue: {
      type: Object,
      required: true
    }
  });
  const emit = defineEmits(["change"]);
  const { t } = i18n.global;

  function getExtendedMarkerList(markerList: any[]) {
    return markerList.map((marker, index) => {
      const value = (marker as any).value;
      const label = (marker as any).label;
      const classes = (marker as any).classes;
      const style = (marker as any).style;

      return {
        index,
        label,
        value,
        classes,
        style
      };
    });
  }

  const secondModel = computed(() => {
    const { min = 0, max = 5 } = props.rangeValue || {};

    const adjustValue = (value: number, unit: string, limit: number) => {
      switch (unit) {
        case "K":
          return value != null ? (value - 5000) / 5000 : limit;
        case "Million":
          return value != null ? (value - 500000) / 500000 : limit;
        default:
          return value != null ? value / props.options.multiplier : limit;
      }
    };

    const minValue = adjustValue(min, props.options.unit, 0);
    const maxValue = adjustValue(max, props.options.unit, 5);

    return { min: minValue, max: maxValue };
  });

  const formateTitle = computed(() => {
    const { min, max } = secondModel.value;

    const unit = props.options.unit || "";
    const multiplier = props.options.multiplier || 1;
    const finalMin = props.options.priceMin ? (Number(min) + 1) * multiplier : min * multiplier;
    const finalMax = props.options.priceMin ? (Number(max) + 1) * multiplier : max * multiplier;
    const limit = 5;
    let title = "";
    if (min === 0 && max === limit) {
      title = "";
    } else if (max === limit && min > 0) {
      title = `${t(props.options.label)} ( ${finalMin} ${unit}+ )`;
    } else if (min === max) {
      title = `${t(props.options.label)} ( ${finalMin} ${unit} )`;
    } else {
      title = `${t(props.options.label)} ( ${finalMin} to ${finalMax} ${unit} )`;
    }

    if (title == "") {
      title = `${t(props.options.label)} ( ${props.options.unit})`;
    }

    return title;
  });

  const markerLabels = computed(() => {
    const labels = { 0: "0", 1: "1", 2: "2", 3: "3", 4: "4", 5: "5+" };
    return props.options.markerLabels ? props.options.markerLabels : labels;
  });

  function onUpdateModel(val: any) {
    emit("change", val);
  }
</script>
