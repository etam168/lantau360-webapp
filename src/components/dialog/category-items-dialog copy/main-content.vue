<template>
  <q-table v-bind="$attrs" flat hide-header hide-pagination :rows="rows" :row-key="rowKey">
    <template v-slot:top>
      <div class="full-height">
        <q-card flat bordered class="q-ma-md">
          <q-responsive :ratio="16 / 9">
            <q-card-section>{{
              translate(directory.shortName, directory.meta, "shortName")
            }}</q-card-section>
          </q-responsive>
        </q-card>
      </div>
    </template>

    <template v-slot:body="{ row }">
      <div :class="itemClass">
        <app-category-item
          :categoryItem="row"
          :distance="0"
          entity-key="SITE"
          @on-directory-item="handleDetail(row)"
        />
      </div>
    </template>
  </q-table>
</template>

<script setup lang="ts">
  // Types
  import type { BusinessDirectory } from "@/interfaces/models/entities/business-directory";
  import type { CategoryTypes } from "@/interfaces/types/category-types";
  import type { DirectoryTypes } from "@/interfaces/types/directory-types";
  import type { SiteDirectory } from "@/interfaces/models/entities/site-directory";

  // Constants
  import type { EntityURLKey } from "@/constants";

  // Props
  const { categoryItems, directory, entityKey, style } = defineProps<{
    categoryItems: CategoryTypes[];
    directory: DirectoryTypes;
    entityKey: EntityURLKey;
    style?: any;
  }>();

  const { t, locale } = useI18n({ useScope: "global" });
  const { isSmallScreen } = useUtilities(locale.value);
  const $q = useQuasar();
  const { openCategoryDetailDialog } = useCategoryDialogService(entityKey);

  const tab = ref("location");
  const titleClass = computed(() => (isSmallScreen.value ? "text-center" : undefined));

  const tabItems = ref<TabItem[]>([
    { name: "location", label: t(`${i18nKey}.tabItem.location`) },
    { name: "business", label: t(`${i18nKey}.tabItem.business`) },
    { name: "checkIn", label: t(`${i18nKey}.tabItem.checkIn`) }
  ]);

  const rows = computed(() => {
    switch (tab.value) {
      case "location":
        return siteItems;
      case "business":
        return businessItems;
      case "checkIn":
        return checkinItems;
      default:
        return [];
    }
  });

  const rowKey = computed(() => {
    switch (tab.value) {
      case "location":
        return "siteId";
      case "business":
        return "businessId";
      case "checkIn":
        return "siteId";
      default:
        return "";
    }
  });

  const itemClass = computed(() => {
    return tab.value === "checkIn" ? "col-12" : "col-xs-12 col-sm-6 col-md-4 q-pa-xs";
  });

  const setTab = (val: string) => (tab.value = val);

  const cardStyle = computed(() => ({
    borderTop: "1px solid rgba(0, 0, 0, 0.12)",
    borderBottom: "1px solid rgba(0, 0, 0, 0.12)"
  }));

  defineEmits<{
    (e: "onCategoryDetail", value: SiteView | BusinessView): void;
    (e: "onCheckInDetail", value: CheckInView): void;
  }>();

  async function handleDetail(item: any) {
    const entityKey = item.siteId ? "SITE" : "BUSINESS";
    openCategoryDetailDialog(item, entityKey);
  }
</script>

<style lang="scss">
  .q-table__top {
    padding: 0 !important;
  }
</style>
