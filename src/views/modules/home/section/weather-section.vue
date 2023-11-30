<template>
  <q-card class="text-white q-ma-md bg-primary q-pa-sm">
    <q-item>
      <q-item-section top>
        <q-avatar size="64px" class="q-mb-sm">
          <q-img :src="iconPath" />
        </q-avatar>

        <q-item-label class="text-weight-medium text-subtitle1">{{ caption }}</q-item-label>
        <q-item-label class="text-caption">{{ weatherDate }}</q-item-label>
      </q-item-section>

      <q-item-section top side class="text-white">
        <q-chip
          class="q-ma-none q-pa-none"
          dense
          color="transparent"
          text-color="white"
          size="36px"
          :icon-right="undefined"
        >
          {{ data?.tempValue + "°" + data?.unit }}
        </q-chip>

        <q-chip
          class="q-ma-none"
          dense
          color="transparent"
          text-color="white"
          size="md"
          icon-right="fa-solid fa-arrow-up"
        >
          {{ data?.minTemp + "°" + data?.unit }}
        </q-chip>

        <q-chip
          class="q-ma-none"
          dense
          color="transparent"
          text-color="white"
          size="md"
          icon-right="fa-solid fa-arrow-down"
        >
          {{ data?.maxTemp + "°" + data?.unit }}
        </q-chip>
      </q-item-section>
    </q-item>
  </q-card>
</template>

<script setup lang="ts">
  // Vue Import
  import { PropType, computed } from "vue";

  // 3rd party
  import { date } from "quasar";

  // .ts file
  import { Weather } from "@/interfaces/models/entities/weather";
  import { useUtilities } from "@/composable/use-utilities";
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
    return new URL(`../../../../assets/img/${fileNameWithoutExtension}.svg`, import.meta.url).href;
  });

  const weatherDate = computed(() =>
    date.formatDate(props.data?.forecastDateTime, "YYYY-MM-DD HH:MM")
  );
</script>
