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
  import type { Weather } from "@/interfaces/models/entities/weather";
  import { date } from "quasar";
  import { fasArrowUp, fasArrowDown } from "@quasar/extras/fontawesome-v6";

  const { data } = defineProps<{
    data: Weather | null;
  }>();

  const { locale } = useI18n({ useScope: "global" });

  const { translate } = useUtilities(locale.value);

  const caption = computed(() => {
    return translate(data?.caption ?? "", data?.meta, "caption");
  });

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const iconPath = computed(() => {
    const fileNameWithoutExtension = data?.icon.split(".")[0];
    return `/resources/weather/${fileNameWithoutExtension}.svg`;
  });

  const weatherDate = computed(() => date.formatDate(data?.forecastDateTime, "YYYY-MM-DD HH:MM"));

  const chips = computed(() => [
    {
      class: "q-pa-none",
      size: "32px",
      iconRight: undefined,
      content: `${data?.tempValue}°${data?.unit}`
    },
    {
      size: "md",
      iconRight: fasArrowUp,
      content: `${data?.maxTemp}°${data?.unit}`
    },
    {
      size: "md",
      iconRight: fasArrowDown,
      content: `${data?.minTemp}°${data?.unit}`
    }
  ]);
</script>
