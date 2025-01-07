<template>
  <q-table
    v-bind="$attrs"
    flat
    square
    hide-pagination
    hide-header
    :hide-bottom="checkinItems.length > 0"
    row-key="siteId"
    :card-style="cardStyle"
    :rows="checkinItems"
    :rows-per-page-options="[0]"
  >
    <template v-slot:body="props">
      <q-tr :props="props">
        <!-- Main Content -->
        <q-td auto-width style="padding: 0">
          <app-checkin-item
            :image-path="props.row.siteData?.iconPath"
            :line1="getLine1(props.row)"
            :line2="getLine2(props.row)"
            @click="showDetailDialog(props.row)"
          />
        </q-td>

        <!-- Actions Menu -->
        <q-td auto-width class="text-right">
          <!-- <pre>{{ props.row }}</pre> -->
          <q-btn size="sm" dense flat :icon="fasEllipsis">
            <q-menu>
              <q-list style="min-width: 100px">
                <q-item clickable v-close-popup>
                  <q-item-section class="text-red">Delete</q-item-section>
                </q-item>
              </q-list>
            </q-menu>
          </q-btn>
        </q-td>
      </q-tr>
    </template>

    <!-- No Data Message -->
    <template v-slot:no-data>
      <app-no-record-message :message="$t(`errors.noCheckinRecord`)" />
    </template>
  </q-table>
</template>

<script setup lang="ts">
  import { fasEllipsis } from "@quasar/extras/fontawesome-v6";
  import type { CheckInView } from "@/interfaces/models/views/checkin-view";
  import { ref, computed } from "vue";
  import { useCheckInStore } from "@/stores/checkin-store";

  // Props
  const { i18nKey = "" } = defineProps<{
    i18nKey?: string;
  }>();

  // Quasar Utilities
  const $q = useQuasar();
  const { locale, t } = useI18n({ useScope: "global" });
  const { dateFormatter, translate } = useUtilities(locale.value);

  // Check-in Store
  const checkInStore = useCheckInStore();
  const checkinItems = computed<CheckInView[]>(() => checkInStore.checkInSites);

  // Dynamic Card Style
  const cardStyle = computed(() => ({
    borderTop: "1px solid rgba(0, 0, 0, 0.12)",
    borderBottom: "1px solid rgba(0, 0, 0, 0.12)"
  }));

  // Extract Line Information
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
      ? t(`${i18nKey}.lastCheckIn`, {
          date: dateFormatter(lastCheckIn.checkInAt)
        })
      : "";
  };

  // Dialog and Menu Actions
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

  const menuVisible = ref(false);

  const openMenu = (row: CheckInView) => {
    menuVisible.value = true;
  };

  const onEdit = (row: CheckInView) => {
    menuVisible.value = false;
    console.log("Edit clicked for:", row);
  };

  const onDelete = (row: CheckInView) => {
    menuVisible.value = false;
    console.log("Delete clicked for:", row);
  };
</script>
