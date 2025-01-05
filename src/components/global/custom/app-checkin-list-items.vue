<template>
  <q-table
    class="bg-red"
    flat
    square
    hide-pagination
    hide-header
    :hide-bottom="checkinItems.length > 0"
    row-key="siteId"
    :card-style="cardStyle"
    :rows="checkinItems"
    :style="tableStyle"
  >
    <template v-slot:body="props">
      <q-tr :props="props">
        <q-td auto-width style="padding: 0">
          <app-checkin-item
            :image-path="props.row.siteData?.iconPath"
            :line1="getLine1(props.row)"
            :line2="getLine2(props.row)"
            @click="showDetailDialog(props.row)"
          />
        </q-td>
      </q-tr>
    </template>

    <template v-slot:no-data>
      <app-no-record-message :message="$t('errors.noCheckinRecord')" />
    </template>
  </q-table>
</template>

<script setup lang="ts">
  // Types
  import type { CheckInView } from "@/interfaces/models/views/checkin-view";
  import { useCheckInStore } from "@/stores/checkin-store";

  // Constants
  import { MAX_SCREEN_WIDTH } from "@/constants";

  // Props
  const { i18nKey = "" } = defineProps<{
    i18nKey?: string;
  }>();

  const $q = useQuasar();
  const { locale, t } = useI18n({ useScope: "global" });
  const { aspectRatio, dateFormatter, translate } = useUtilities(locale.value);
  const checkInStore = useCheckInStore();

  const THRESHOLD = 320;
  const ADDITIONAL_HEIGHT = 160;
  const checkinItems = computed<CheckInView[]>(() => checkInStore.checkInSites);

  const cardStyle = computed(() => ({
    borderTop: "1px solid rgba(0, 0, 0, 0.12)",
    borderBottom: "1px solid rgba(0, 0, 0, 0.12)"
  }));

  const usedHeight = computed(() => {
    const width = Math.min($q.screen.width, MAX_SCREEN_WIDTH);
    return width * aspectRatio() + ADDITIONAL_HEIGHT;
  });

  const tableStyle = computed<Record<string, any> | undefined>(() => {
    const height = $q.screen.height - usedHeight.value;
    return height > THRESHOLD ? { height: `calc(100vh - ${usedHeight.value}px)` } : undefined;
  });

  const getLine1 = (item: CheckInView): string => {
    const { siteName, meta } = item.siteData ?? {};
    return siteName ? translate(siteName, meta, "siteName") : "";
  };

  const getLine2 = (item: CheckInView): string => {
    const checkInfo = item.checkInfo ?? [];
    if (!checkInfo.length) return "";

    const lastCheckIn = checkInfo.reduce((latest, current) =>
      new Date(current.checkInAt) > new Date(latest.checkInAt) ? current : latest
    );

    const d = dateFormatter(lastCheckIn.checkInAt);

    return lastCheckIn.checkInAt
      ? t(`${i18nKey}.checkIn.lastCheckIn`, {
          date: dateFormatter(lastCheckIn.checkInAt)
        })
      : "";
  };

  const showDetailDialog = (item: CheckInView) => {
    $q.dialog({
      component: defineAsyncComponent(
        () => import("@/components/dialog/checkin-detail-dialog/index.vue")
      ),
      componentProps: {
        item,
        dialogName: "checkinDetailDialog"
      }
    });
  };
</script>
