<template>
  <q-item clickable class="full-width" @click="$emit('click')">
    <q-item-section avatar>
      <app-avatar-rounded :image-path="computedImagePath" size="54px" />
    </q-item-section>

    <q-item-section>
      <q-item-label>{{ getLine1 }}</q-item-label>
      <q-item-label caption>{{ getLine2 }}</q-item-label>
    </q-item-section>
  </q-item>
</template>

<script setup lang="ts">
  import { useI18n } from 'vue-i18n';

  // Props
  const { siteData, checkInfo, i18nKey } = defineProps<{
    siteData?: { iconPath?: string; siteName?: string; meta?: any };
    checkInfo?: Array<{ checkInAt: string }>;
    i18nKey: string;
  }>();

  const { t } = useI18n({ useScope: 'global' });
  const { translate, dateFormatter } = useUtilities();

  // Computed for Image Path
  const computedImagePath = computed(() => {
    return siteData?.iconPath ?? ''; // Default to an empty string if iconPath is not available
  });

  // Computed for Line1
  const getLine1 = computed(() => {
    const { siteName, meta } = siteData ?? {};
    return siteName ? translate(siteName, meta, 'siteName') : '';
  });

  // Computed for Line2
  const getLine2 = computed(() => {
    if (!checkInfo || !checkInfo.length) return '';

    const lastCheckIn = checkInfo.reduce((latest, current) =>
      new Date(current.checkInAt) > new Date(latest.checkInAt) ? current : latest
    );

    return lastCheckIn.checkInAt
      ? t(`${i18nKey}.lastCheckIn`, {
          date: dateFormatter(lastCheckIn.checkInAt),
        })
      : '';
  });

  defineEmits<{
    (e: 'click'): void;
  }>();
</script>
