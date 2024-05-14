<template>
  <q-dialog
    ref="dialogRef"
    transition-show="slide-up"
    transition-hide="slide-down"
    @update:model-value="updateDialogState"
    :model-value="isDialogVisible"
    maximized
  >
    <q-layout view="lHh lpr lFr" class="bg-white" container style="max-width: 1024px">
      <q-header bordered class="bg-transparent text-dark">
        <app-dialog-title>{{ dialogTitle }}</app-dialog-title>
      </q-header>

      <q-page-container>
        <q-page>
          <!-- Check if groupBykey exists -->
          <template v-if="groupBykey">
            <app-tab-select
              :tab-items="tabItems"
              :current-tab="tab"
              @update:currentTab="setTab"
              :class="$q.screen.lt.sm ? 'q-pt-sm' : ''"
            />

            <q-tab-panels v-model="tab">
              <q-tab-panel v-for="(item, index) in tabItems" :key="index" :name="item.label">
                <!-- Pass filterGroupedArray(item.name) if groupBykey exists -->
                <app-category-item-list
                  @item-click="onItemClick"
                  :directoryItems="filterGroupedArray(item.name)"
                  :favoriteItems="favoriteItems"
                  :template="template"
                />
              </q-tab-panel>
            </q-tab-panels>
          </template>

          <!-- If groupBykey doesn't exist, show the linear app-category-item-list -->
          <template v-else>
            <app-category-item-list
              class="q-px-md q-pt-md q-pb-none"
              @item-click="onItemClick"
              :directoryItems="directoryItems"
              :favoriteItems="favoriteItems"
              :template="template"
              style="position: relative"
            />
          </template>
        </q-page>
      </q-page-container>
    </q-layout>
  </q-dialog>
</template>

<script setup lang="ts">
  // interface files
  import { CategoryTypes } from "@/interfaces/types/category-types";
  import { DirectoryTypes } from "@/interfaces/types/directory-types";
  import { SiteView } from "@/interfaces/models/views/site-view";
  import { BusinessView } from "@/interfaces/models/views/business-view";
  import { TabItem } from "@/interfaces/tab-item";

  // others import
  import { useDialogPluginComponent, useQuasar, LocalStorage } from "quasar";
  import { NONE, STORAGE_KEYS, AREA_NAME, URL } from "@/constants";
  import { Directory } from "@/interfaces/models/entities/directory";
  import { useUserStore } from "@/stores/user";

  const props = defineProps({
    directoryItemsList: {
      type: Array as PropType<CategoryTypes[]>,
      required: true
    },
    directory: {
      type: Object as PropType<DirectoryTypes>,
      required: true
    }
  });

  const { dialogRef } = useDialogPluginComponent();
  const { groupBy, translate, eventBus } = useUtilities();
  const $q = useQuasar();
  const isDialogVisible = ref();
  const directoryItems = ref<any>(props?.directoryItemsList ?? []);
  const favoriteItems = ref<any>(getFavItem() || []);
  const { locale } = useI18n();
  const userStore = useUserStore();

  const dialogTitle = computed(() =>
    translate(props.directory.directoryName, props.directory.meta, "directoryName")
  );

  const template = computed(() => props.directory.meta?.template);
  const groupBykey = computed(() =>
    props.directory.meta?.groupByKey !== NONE ? props.directory.meta?.groupByKey : null
  );

  const groupedArray = computed(() => {
    // Use the groupKey prop with a fallback to "directoryName"
    const key = groupBykey.value as keyof CategoryTypes;
    return groupBy(
      directoryItems.value.filter((item: any) => item[key] !== undefined),
      (item: any) =>
        translate(item[key], groupBykey.value == AREA_NAME ? item.areaNameAlt : item.meta, key) as
          | string
          | number // Make sure the key exists on the item
    );
  });

  // Function to filter groupedArray by group name
  const filterGroupedArray = (groupName: string) => {
    const items = groupedArray.value.filter(group => group.group === groupName).pop()?.items || [];

    // prepare the code to have conditional sorting later
    return items.sort((a, b) => a.rank - b.rank);
  };

  // Define tabItems as a computed property
  const tabItems = computed(() => {
    // Map over the groupedArray to create tabItems
    return groupedArray.value.map(group => ({
      name: group.group,
      label: group.group
    })) as TabItem[];
  });

  const tab = ref(tabItems.value.length > 0 ? tabItems.value[0].name : "");
  const setTab = (val: string) => (tab.value = val);

  onMounted(() => {
    eventBus.on("CategoryItemListDialog", () => {
      isDialogVisible.value = false;
    });

    eventBus.on("refresh-directory-items", () => {
      refreshDirectoryItems(props.directory);
    });
  });

  eventBus.on("favoriteUpdated", () => {
    favoriteItems.value = getFavItem();
  });

  function updateDialogState(status: boolean) {
    isDialogVisible.value = status;
    eventBus.emit("DialogStatus", status, "CategoryItemListDialog");
  }

  function onItemClick(item: CategoryTypes) {
    $q.dialog({
      component: defineAsyncComponent(
        () => import("@/components/dialog/category-detail-dialog.vue")
      ),
      componentProps: {
        item: item
      }
    });
  }

  function getFavItem() {
    switch (true) {
      case directoryItems.value.length === 0:
        return [];
      case "siteId" in directoryItems.value[0]:
        return (LocalStorage.getItem(STORAGE_KEYS.SAVED.SITE) || []) as SiteView[];
      case "businessId" in directoryItems.value[0]:
        return (LocalStorage.getItem(STORAGE_KEYS.SAVED.BUSINESS) || []) as BusinessView[];
      default:
        return [];
    }
  }

  const refreshDirectoryItems = async (item: DirectoryTypes) => {
    try {
      const directoryListUrl = `${URL.DIRECTORY_LIST.MEMBER_CHECKED_IN_SITES}?directoryId=${(props.directory as Directory).directoryId}&memberId=${userStore.userId}`;
      // const response = await axios.get(directoryListUrl);
      const [response] = await Promise.all([axios.get(directoryListUrl)]);
      if (response.status === 200) {
        // let directoryItems = null;
        const sortByKey = item.meta.sortByKey;

        const itemList = useSorted(response.data, (a, b) => {
          const rankingDifference = a.rank - b.rank;
          // Check if sortByKey exists in the first object
          const hasSortByKey = sortByKey in response.data[0];
          // If sortByKey exists, use it for comparison
          if (hasSortByKey) {
            let sortByKeyComparison;
            if (locale.value == "en") {
              sortByKeyComparison = String(a[sortByKey]).localeCompare(String(b[sortByKey]));
            } else {
              sortByKeyComparison = String(
                a?.meta?.i18n[locale.value]?.[sortByKey] ?? sortByKey
              ).localeCompare(String(b?.meta?.i18n[locale.value]?.[sortByKey] ?? b[sortByKey]));
              // If sortByKey comparison is not equal, return it; otherwise, use ranking difference
            }

            return sortByKeyComparison !== 0 ? sortByKeyComparison : rankingDifference;
          }

          // If sortByKey doesn't exist, fall back to ranking difference
          return (
            rankingDifference || new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
        });
        directoryItems.value = itemList.value;
        debugger;
      }
    } catch (error) {
      // console.error("Error fetching data: ", error);
    }
  };
</script>
