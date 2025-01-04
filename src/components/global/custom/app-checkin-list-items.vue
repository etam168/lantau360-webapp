<template>
  <q-table grid flat :rows="checkinItems" row-key="siteId" hide-pagination>
    <template v-slot:item="props">
      <q-item clickable @click="handleDetail(props.row)" class="full-width">
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
  </q-table>
</template>
<script setup lang="ts">
  // Interface files
  import type { CheckInView } from "@/interfaces/models/views/checkin-view";

  // Stores
  import { useCheckInStore } from "@/stores/checkin-store";

  // Emits
  const emits = defineEmits(["on-member-detail"]);

  // Reactive variables
  const $q = useQuasar();
  const { locale, t } = useI18n({ useScope: "global" });
  const checkInStore = useCheckInStore();
  const checkinItems = computed<CheckInView[]>(() => checkInStore.checkInSites);

  const { dateFormatter, translate } = useUtilities(locale.value);

  const i18nKeyMoreDialog = "more.mainMenuDialog";

  const computeIconPath = (item: any) => {
    const iconPath = item.siteData?.meta?.site.iconPath;

    return iconPath;
  };

  // line1 function to retrieve the siteName from the row
  function line1(item: CheckInView) {
    const siteName = item.siteData?.meta?.site?.siteName;
    if (siteName) {
      return translate(siteName, item.siteData?.meta, "siteName");
    }
    return ""; // Return empty string if siteName is not found
  }

  // line2 function to retrieve and format the last check-in date
  function line2(item: CheckInView) {
    const checkInfo = item.checkInfo || [];

    // Find the latest check-in object by checking the latest `checkInAt` value
    const latestCheckIn = checkInfo.reduce(
      (latest, current) => {
        return new Date(current.checkInAt) > new Date(latest.checkInAt) ? current : latest;
      },
      { checkInAt: "1970-01-01T00:00:00.000Z" }
    );

    // If a valid check-in exists, format and display it
    if (latestCheckIn.checkInAt) {
      const formattedDate = dateFormatter(latestCheckIn.checkInAt); // Format the date as per your requirement
      return t(`${i18nKeyMoreDialog}.checkin.lastCheckIn`, { date: formattedDate });
    }

    return ""; // Return empty if no valid check-in date is found
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
