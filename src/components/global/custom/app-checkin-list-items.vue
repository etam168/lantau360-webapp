<template>
  <q-card v-for="(item, index) in checkinItems" :key="index" class="q-ma-md">
    <q-card-section class="q-pa-none">
      <q-list>
        <q-item clickable @click="handleDetail(item)">
          <q-item-section avatar>
            <q-avatar size="64px" circle>
              <!-- Accessing siteData for each item -->
              <q-img ratio="1" :src="computeIconPath(item.siteData?.meta.site)">
                <template v-slot:error>
                  <div class="absolute-full flex flex-center bg-negative text-white">
                    {{ $t("errors.cannotLoadImage") }}
                  </div>
                </template>
              </q-img>
            </q-avatar>
          </q-item-section>

          <q-item-section>
            <!-- Displaying siteData properties -->
            <q-item-label>{{ item.siteData?.meta.site.siteName }}</q-item-label>

            <q-item-label lines="2" v-if="item.siteData?.checkInfo?.length > 0">
              <span v-for="(checkin, index) in item.siteData?.checkInfo" :key="index">
                {{
                  $t(`${i18nKeyMoreDialog}.checkin.lastCheckIn`, {
                    date: dateFormatter(checkin.checkInAt)
                  })
                }}
              </span>
            </q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
  // Interface files
  import type { CheckInView } from "@/interfaces/models/views/checkin-view";

  // Stores
  import { useCheckInStore } from "@/stores/checkin-store";

  // .ts files
  import { BLOB_URL } from "@/constants";

  const emits = defineEmits(["on-member-detail"]);

  const $q = useQuasar();
  const { locale } = useI18n({ useScope: "global" });
  const checkInStore = useCheckInStore();
  const checkinItems = computed<CheckInView[]>(() => checkInStore.checkInSites);

  const { dateFormatter } = useUtilities(locale.value);

  const i18nKeyMoreDialog = "more.mainMenuDialog";

  const computeIconPath = (siteData: any) => {
    return siteData.iconPath
      ? `${BLOB_URL}/${siteData.iconPath}`
      : "./img/icons/no_image_available.jpeg";
  };

  async function handleDetail(item: CheckInView) {
    $q.dialog({
      component: defineAsyncComponent(
        () => import("@/components/dialog/checkin-detail-dialog/index.vue")
      ),
      componentProps: { item: item, dialogName: "checkinDetailDialog" }
    })
      .onCancel(() => {})
      .onOk(() => {});

    // openCategoryDetailDialog(item,"CheckInItemDetailDialog");
  }
</script>
