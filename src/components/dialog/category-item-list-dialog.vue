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
          <template v-if="groupBykey">
            <app-tab-select :tab-items="tabItems" :current-tab="tab" @update:currentTab="setTab" />

            <app-tab-panels v-model="tab">
              <q-tab-panel v-for="(item, index) in tabItems" :key="index" :name="item.label">
                <!-- Pass filterGroupedArray(item.name) if groupBykey exists -->
                <app-directory-item-list
                  @item-click="onItemClick"
                  :directoryItems="filterGroupedArray(item.name)"
                  :favoriteItems="favoriteItems"
                />
              </q-tab-panel>
            </app-tab-panels>
          </template>

          <!-- If groupBykey doesn't exist, show the single app-directory-item-list -->
          <template v-else>
            <app-directory-item-list
              @item-click="onItemClick"
              :directoryItems="directoryItems"
              :favoriteItems="favoriteItems"
            />
          </template>
        </q-page>
      </q-page-container>
    </q-layout>
  </q-dialog>
</template>

<script setup lang="ts">
  import { useDialogPluginComponent, useQuasar, LocalStorage } from "quasar";

  import { STORAGE_KEYS } from "@/constants";
  import { Business } from "@/interfaces/models/entities/business";
  import { Directory } from "@/interfaces/models/entities/directory";
  import { Posting } from "@/interfaces/models/entities/posting";
  import { Site } from "@/interfaces/models/entities/site";
  import { TabItem } from "@/interfaces/tab-item";
  import eventBus from "@/utils/event-bus";

  type CategoryTypes = Business | Site | Posting;
  type GroupKeys = keyof CategoryTypes;

  const props = defineProps({
    directoryItemsList: {
      type: Array as PropType<CategoryTypes[]>,
      required: true
    },
    directory: {
      type: Object as PropType<Directory>,
      required: true
    },
    groupBykey: {
      type: String,
      required: false
    }
  });

  const { dialogRef, onDialogHide } = useDialogPluginComponent();
  const { groupBy, translate } = useUtilities();

  const $q = useQuasar();
  const isDialogVisible = ref();

  const favoriteItems = computed(() => {
    if (props.directoryItemsList.length === 0) {
      return [];
    }

    const firstItem = props.directoryItemsList[0];
    switch (true) {
      case "siteId" in firstItem:
        return (LocalStorage.getItem(STORAGE_KEYS.SAVED.SITE) || []) as Site[];
      case "businessId" in firstItem:
        return (LocalStorage.getItem(STORAGE_KEYS.SAVED.BUSINESS) || []) as Business[];
      default:
        return [];
    }
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

  function updateDialogState(status: any) {
    isDialogVisible.value = status;
    eventBus.emit("DialogStatus", status, "CategoryItemListDialog");
  }

  function onItemClick(item: CategoryTypes) {
    if (props.directory.directoryName === "Timetable") {
      $q.dialog({
        component: defineAsyncComponent(() => import("@/components/dialog/timetable-dialog.vue")),
        componentProps: {
          item: item
        }
      });
    } else if ("siteId" in item) {
      $q.dialog({
        component: defineAsyncComponent(
          () => import("@/components/dialog/category-detail-dialog.vue")
        ),
        componentProps: {
          item: item as Site
        }
      });
    } else if ("businessId" in item) {
      $q.dialog({
        component: defineAsyncComponent(
          () => import("@/components/dialog/category-detail-dialog.vue")
        ),
        componentProps: {
          item: item as Business
        }
      });
    } else if ("postingId" in item) {
      $q.dialog({
        component: defineAsyncComponent(
          () => import("@/components/dialog/community-detail-dialog.vue")
        ),
        componentProps: {
          query: { postingId: (item as Posting).postingId }
        }
      });
    }
  }
</script>
