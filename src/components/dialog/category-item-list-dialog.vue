<template>
  <q-dialog
    ref="dialogRef"
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
          <template v-if="groupBykey">
            <app-tab-select
              :tab-items="tabItems"
              :current-tab="tab"
              @update:currentTab="setTab"
              :class="$q.screen.lt.sm ? 'q-pt-sm' : ''"
            />

            <app-tab-panels v-model="tab">
              <q-tab-panel v-for="(item, index) in tabItems" :key="index" :name="item.label">
                <!-- Pass filterGroupedArray(item.name) if groupBykey exists -->
                <app-category-item-list
                  @item-click="onItemClick"
                  :directoryItems="filterGroupedArray(item.name)"
                  :favoriteItems="favoriteItems"
                  :template="template"
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
            />
          </template>
        </q-page>
      </q-page-container>
      <div v-if="directory?.communityDirectoryId == 2" style="position: relative">
        <q-btn
          fab
          icon="add"
          color="primary"
          style="position: absolute; bottom: 18px; right: 18px"
          @click="createPosting"
        />
      </div>
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
  import { NONE, STORAGE_KEYS, AREA_NAME } from "@/constants";
  import { CommunityDirectory } from "@/interfaces/models/entities/community-directory";

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

  const directoryItems = ref<CategoryTypes[]>(props?.directoryItemsList ?? []);
  const favoriteItems = ref<any>(getFavItem() || []);

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
      directoryItems.value.filter(item => item[key] !== undefined),
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

    eventBus.on("ItemListUpdate", (updatedList: CategoryTypes[]) => {
      directoryItems.value = updatedList;
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
    const directory = "siteId" in item || "businessId" in item ? props.directory : undefined;
    $q.dialog({
      component: defineAsyncComponent(
        () => import("@/components/dialog/category-detail-dialog.vue")
      ),
      componentProps: {
        item: item,
        directory: directory
      }
    });
  }

  function createPosting() {
    $q.dialog({
      component: defineAsyncComponent(
        () => import("@/views/modules/community/input-dialog/index.vue")
      ),
      componentProps: {
        directoryId: (props.directory as CommunityDirectory).communityDirectoryId
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
</script>
