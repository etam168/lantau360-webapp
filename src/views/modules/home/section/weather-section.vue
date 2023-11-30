<template>
  <q-card class="text-white bg-primary q-ma-md" :class="classWeather">
    <q-item>
      <q-item-section>
        <q-item class="q-pa-none">
          <q-item-section>
            <q-avatar size="56px">
              <q-img :src="iconPath" />
            </q-avatar>

            <q-item-label class="text-weight-medium text-subtitle1">{{ caption }}</q-item-label>
            <q-item-label class="text-caption">{{ weatherDate }}</q-item-label>
          </q-item-section>
        </q-item>
      </q-item-section>

      <q-item-section side>
        <q-chip
          v-for="(chip, index) in chips"
          :key="index"
          :class="chip.class"
          :size="chip.size"
          :icon-right="chip.iconRight"
          class="q-ma-none"
          color="transparent"
          text-color="white"
          dense
        >
          {{ chip.content }}
        </q-chip>
      </q-item-section>
    </q-item>
  </q-card>
</template>

<script setup lang="ts">
  // Vue Import
  import { PropType, computed } from "vue";

  // 3rd party
  import { date, useQuasar } from "quasar";

  // .ts file
  import { Weather } from "@/interfaces/models/entities/weather";
  import { useUtilities } from "@/composable/use-utilities";

  const $q = useQuasar();
  const { translate } = useUtilities();

  const props = defineProps({
    data: {
      type: Object as PropType<Weather | null>,
      required: false,
      default: null
    }
  });

  const caption = computed(() => {
    return translate(props.data?.caption ?? "", props.data?.meta, "caption");
  });

  const iconPath = computed(() => {
    const fileNameWithoutExtension = props.data?.icon.split(".")[0];
    return `/img/weather/${fileNameWithoutExtension}.svg`;
  });

  const weatherDate = computed(() =>
    date.formatDate(props.data?.forecastDateTime, "YYYY-MM-DD HH:MM")
  );

  const classWeather = computed(() => {
    return $q.screen.gt.xs ? "q-pa-sm" : "q-pa-none";
  });

  const chips = computed(() => [
    {
      class: "q-pa-none",
      size: "32px",
      iconRight: undefined,
      content: `${props.data?.tempValue}°${props.data?.unit}`
    },
    {
      size: "md",
      iconRight: "fa-solid fa-arrow-up",
      content: `${props.data?.maxTemp}°${props.data?.unit}`
    },
    {
      size: "md",
      iconRight: "fa-solid fa-arrow-down",
      content: `${props.data?.minTemp}°${props.data?.unit}`
    }
  ]);
</script>
