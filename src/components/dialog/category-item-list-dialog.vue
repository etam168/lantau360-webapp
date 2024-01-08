<template>
  <q-dialog
    ref="dialogRef"
    @hide="onDialogHide"
    transition-show="slide-up"
    transition-hide="slide-down"
    @update:model-value="updateDialogState"
    :model-value="isDialogVisible"
    maximized
  >
    <q-layout view="lHh lpr lFf" class="bg-white" style="max-width: 1024px">
      <q-header class="bg-transparent text-dark">
        <app-dialog-title>{{ dialogTitle }}</app-dialog-title>
      </q-header>

      <q-page-container>
        <q-page>
          <!-- Check if groupBykey exists -->
          <template v-if="groupMenuStatus">
            <app-tab-select
              :tab-items="tabItems"
              :current-tab="tab"
              @update:currentTab="setTab"
              :class="$q.screen.lt.sm ? 'q-pt-sm' : ''"
            />

            <app-tab-panels v-model="tab">
              <q-tab-panel
                v-for="(item, index) in tabItems"
                :key="index"
                :name="item.label"
                class="q-pa-none"
              >
                <!-- Pass filterGroupedArray(item.name) if groupBykey exists -->
                <app-category-item-list
                  @item-click="onItemClick"
                  :directoryItems="filterGroupedArray(item.name)"
                  :favoriteItems="favoriteItems"
                  :template="template"
                  class="q-px-md q-py-none"
                />
              </q-tab-panel>
            </app-tab-panels>
          </template>

          <!-- If groupBykey doesn't exist, show the linear app-category-item-list -->
          <template v-else>
            <app-category-item-list
              @item-click="onItemClick"
              :directoryItems="directoryItems"
              :favoriteItems="favoriteItems"
              :template="template"
              class="q-pa-md"
              padding
            />
          </template>
        </q-page>
      </q-page-container>
    </q-layout>
  </q-dialog>
</template>

<script setup lang="ts">
  import { useDialogPluginComponent, useQuasar, LocalStorage } from "quasar";

  // interface files
  import { CategoryTypes } from "@/interfaces/types/category-types";
  import { DirectoryTypes } from "@/interfaces/types/directory-types";
  import { SiteView } from "@/interfaces/models/views/site-view";
  import { BusinessView } from "@/interfaces/models/views/business-view";
  import { TabItem } from "@/interfaces/tab-item";

  // .ts file
  import { NONE, STORAGE_KEYS } from "@/constants";

  type GroupKeys = keyof CategoryTypes;

  const props = defineProps({
    directoryItemsList: {
      type: Array as PropType<CategoryTypes[]>,
      required: true
    },
    directory: {
      type: Object as PropType<DirectoryTypes>,
      required: true
    },
    groupBykey: {
      type: String,
      required: false
    }
  });

  const { dialogRef, onDialogHide } = useDialogPluginComponent();
  const { groupBy, translate, eventBus } = useUtilities();

  const $q = useQuasar();
  const isDialogVisible = ref();

  const favoriteItems = ref<any>(getFavItem() || []);

  const groupMenuStatus = computed(() => {
    return props.groupBykey != NONE && props.groupBykey != null;
  });

  const template = computed(() => {
    const temp = props.directory.meta?.template;
    return temp;
  });

  const directoryItems = computed(() => {
    return props.directoryItemsList;
  });

  const dialogTitle = computed(() => {
    return translate(props.directory.directoryName, props.directory.meta, "directoryName");
  });

  const groupedArray = computed(() => {
    // Use the groupKey prop with a fallback to "directoryName"
    const key: GroupKeys = props.groupBykey as GroupKeys;
    return groupBy(
      props.directoryItemsList.filter(item => item[key] !== undefined),
      (item: any) => item[key] as string | number // Make sure the key exists on the item
    );
  });

  // Function to filter groupedArray by group name
  const filterGroupedArray = (groupName: string) => {
    return groupedArray.value.filter(group => group.group === groupName).pop()?.items;
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
  });

  eventBus.on("favoriteUpdated", () => {
    favoriteItems.value = getFavItem();
  });
  function updateDialogState(status: any) {
    isDialogVisible.value = status;
    eventBus.emit("DialogStatus", status, "CategoryItemListDialog");
  }

  function onItemClick(item: CategoryTypes) {
    if ("siteId" in item || "businessId" in item) {
      $q.dialog({
        component: defineAsyncComponent(
          () => import("@/components/dialog/category-detail-dialog.vue")
        ),
        componentProps: {
          item: item,
          directory: props.directory
        }
      });
    } else if ("postingId" in item) {
      $q.dialog({
        component: defineAsyncComponent(
          () => import("@/components/dialog/category-detail-dialog.vue")
        ),
        componentProps: {
          item: item
        }
      });
    }
  }

  function getFavItem() {
    if (props.directoryItemsList.length === 0) {
      return [];
    }
    const firstItem = props.directoryItemsList[0];

    switch (true) {
      case "siteId" in firstItem:
        return (LocalStorage.getItem(STORAGE_KEYS.SAVED.SITE) || []) as SiteView[];
      case "businessId" in firstItem:
        return (LocalStorage.getItem(STORAGE_KEYS.SAVED.BUSINESS) || []) as BusinessView[];
      default:
        return [];
    }
  }
</script>
