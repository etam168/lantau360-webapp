<template>
  <q-table
    grid
    flat
    :rows="checkinItems"
    row-key="siteId"
    hide-pagination
    :style="tableStyle"
    :rows-per-page-options="[0]"
  >
    <template v-slot:item="props">
      <q-item
        clickable
        @click="handleDetail(props.row)"
        class="full-width"
        style="height: fit-content"
      >
        <q-item-section avatar>
          <app-avatar :image-path="computeIconPath(props.row)" size="54px" />
        </q-item-section>

        <q-item-section>
          <q-item-label>{{ line1(props.row) }}</q-item-label>

          <q-item-label lines="2" v-if="props.row?.checkInfo?.length > 0">
            {{ line2(props.row) }}
          </q-item-label>
        </q-item-section>
      </q-item>
    </template>
    <template v-slot:no-data>
      <app-no-record-message :message="$t('errors.noCheckinRecord')" />
    </template>
  </q-table>
</template>

<script setup lang="ts">
  // Interface files
  import type { CheckInView } from "@/interfaces/models/views/checkin-view";

  // Stores
  import { useCheckInStore } from "@/stores/checkin-store";

  // Emits
  const emits = defineEmits(["on-member-detail"]);

  const $q = useQuasar();
  const { locale, t } = useI18n({ useScope: "global" });
  const { dateFormatter, translate } = useUtilities(locale.value);

  const checkInStore = useCheckInStore();
  const checkinItems = computed<CheckInView[]>(() => checkInStore.checkInSites);

  const i18nKeyMoreDialog = "more.mainMenuDialog";
  const THRESHOLD = 320;

  const usedHeight = computed(() => {
    const width = Math.min($q.screen.width, 1024);
    const carouselHeight = (width * 9) / 16;
    return carouselHeight + 193;
  });

  const scrollAreaStyle = computed(() => {
    return { height: `calc(100vh - ${usedHeight.value}px)` };
  });

  const tableStyle = computed(() => {
    return $q.screen.height - usedHeight.value > THRESHOLD ? scrollAreaStyle.value : {};
  });

  const computeIconPath = (item: any) => {
    return item.siteData?.iconPath;
  };

  function line1(item: CheckInView) {
    const siteName = item.siteData?.siteName;
    if (siteName) {
      return translate(siteName, item.siteData?.meta, "siteName");
    }
    return "";
  }

  function line2(item: CheckInView) {
    const checkInfo = item.checkInfo || [];
    const latestCheckIn = checkInfo.reduce(
      (latest, current) => {
        return new Date(current.checkInAt) > new Date(latest.checkInAt) ? current : latest;
      },
      { checkInAt: "1970-01-01T00:00:00.000Z" }
    );

    if (latestCheckIn.checkInAt) {
      const formattedDate = dateFormatter(latestCheckIn.checkInAt);
      return t(`${i18nKeyMoreDialog}.checkin.lastCheckIn`, { date: formattedDate });
    }

    return "";
  }

  async function handleDetail(item: CheckInView) {
    $q.dialog({
      component: defineAsyncComponent(
        () => import("@/components/dialog/checkin-detail-dialog/index.vue")
      ),
      componentProps: { item: item, dialogName: "checkinDetailDialog" }
    })
      .onCancel(() => {})
      .onOk(() => {});
  }
</script>

<style>
  .q-table--grid .q-table__grid-content {
    flex: none;
  }
</style>
