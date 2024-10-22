<template>
  <q-card class="bg-primary text-white q-ma-md q-pa-sm">
    <q-item>
      <q-item-section>
        <q-item class="q-pa-none">
          <q-item-section>
            <q-avatar size="56px" class="q-mb-sm">
              <img :src="iconPath" />
            </q-avatar>
            <q-item-label class="text -weight-medium text-subtitle1">{{ caption }}</q-item-label>
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
  import { date } from "quasar";
  import { fasArrowUp, fasArrowDown } from "@quasar/extras/fontawesome-v6";

  // Interface files
  import { Weather } from "@/interfaces/models/entities/weather";

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

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const iconPath = computed(() => {
    const fileNameWithoutExtension = props.data?.icon.split(".")[0];
    return `/resources/weather/${fileNameWithoutExtension}.svg`;
  });

  const weatherDate = computed(() =>
    date.formatDate(props.data?.forecastDateTime, "YYYY-MM-DD HH:MM")
  );

  const chips = computed(() => [
    {
      class: "q-pa-none",
      size: "32px",
      iconRight: undefined,
      content: `${props.data?.tempValue}°${props.data?.unit}`
    },
    {
      size: "md",
      iconRight: fasArrowUp,
      content: `${props.data?.maxTemp}°${props.data?.unit}`
    },
    {
      size: "md",
      iconRight: fasArrowDown,
      content: `${props.data?.minTemp}°${props.data?.unit}`
    }
  ]);
</script>
