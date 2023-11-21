<template>
  <q-btn-dropdown stretch flat :label="$t(options.label)">
    <q-list padding style="width: 480px">
      <q-item>
        <q-item-section>
          <app-item-title :title="$t(options.title)" />
        </q-item-section>

        <q-item-section side>
          <app-button-clear @click="resetOptions" />
        </q-item-section>
      </q-item>
      <q-separator />

      <q-item>
        <q-item-section>
          <div class="text-center text-subtitle1 text-weight-bold">{{ formattedRange }}</div>
        </q-item-section>
      </q-item>

      <q-item>
        <q-item-section avatar top>
          <q-icon :name="options.icon" />
        </q-item-section>

        <q-item-section class="q-pr-xl" colspan="2">
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
                :class="['text-subtitle1', 'text-weight-medium', marker.classes]"
                :style="marker.style"
                @click="secondModel = marker.value"
              >
                {{ marker.label }}
              </div>
            </template>
          </q-range>
        </q-item-section>
      </q-item>

      <q-item class="q-pa-none">
        <q-item-section top class="q-mx-xl">
          <div class="text-right text-subtitle2">{{ options.unit }}</div>
        </q-item-section>
      </q-item>
    </q-list>
  </q-btn-dropdown>
</template>

<script setup lang="ts">
  // Vue Import
  import { ref, computed } from "vue";

  import AppButtonClear from "@/components/widgets/app-button-clear.vue";
  import AppItemTitle from "@/components/widgets/app-item-title.vue";

  const props = defineProps({
    options: {
      type: Object,
      required: true
    }
  });
  const emit = defineEmits(["change"]);

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

  const secondModel = ref({ min: 0, max: 5 });

  const formattedRange = computed(() => {
    const { min, max } = secondModel.value;

    const unit = props.options.unit || "";
    const multiplier = props.options.multiplier || 1;
    const finalMin = props.options.priceMin ? (Number(min) + 1) * multiplier : min * multiplier;
    const finalMax = props.options.priceMin ? (Number(max) + 1) * multiplier : max * multiplier;

    const limit = 5;

    if (min === 0 && max === limit) {
      return "";
    } else if (max === limit && min > 0) {
      return `${finalMin} ${unit}+`;
    } else if (min === max) {
      return `${finalMin} ${unit}`;
    } else {
      return `${finalMin} to ${finalMax} ${unit}`;
    }
  });

  const markerLabels = computed(() => {
    const labels = { 0: "0", 1: "1", 2: "2", 3: "3", 4: "4", 5: "5+" };
    return props.options.markerLabels ? props.options.markerLabels : labels;
  });

  function resetOptions() {
    secondModel.value = { min: 0, max: 5 };
    onUpdateModel(secondModel.value);
  }

  function onUpdateModel(val: any) {
    emit("change", val);
  }
</script>
