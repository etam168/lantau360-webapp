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
          <app-tab-select :tab-items="tabItems" :current-tab="tab" @update:currentTab="setTab" />

          <app-tab-panels v-model="tab">
            <q-tab-panel v-for="(item, index) in tabItems" :key="index" :name="item.label">
              <app-directory-item-list
                @item-click="onItemClick"
                :directoryItems="filterGroupedArray(item.name)"
                :favoriteItems="favoriteItems"
              />
            </q-tab-panel>
          </app-tab-panels>
        </q-page>
      </q-page-container>
    </q-layout>
  </q-dialog>
</template>

<script setup lang="ts">
  import { useDialogPluginComponent, useQuasar, LocalStorage } from "quasar";

  import { STORAGE_KEYS } from "@/constants";
  import { Directory } from "@/interfaces/models/entities/directory";
  import { Site } from "@/interfaces/models/entities/site";
  import { TabItem } from "@/interfaces/tab-item";
  import eventBus from "@/utils/event-bus";

  const { dialogRef, onDialogHide } = useDialogPluginComponent();
  const { groupBy, translate } = useUtilities();

  // Define a type that includes all possible keys you want to group by
  type GroupKeys = keyof Site;

  const props = defineProps({
    directoryItemsList: {
      type: Array as PropType<Site[]>,
      required: true
    },
    directory: {
      type: Object as PropType<Directory>,
      required: true
    },
    groupBykey: {
      type: String,
      default: "subtitle3"
    }
  });

  const $q = useQuasar();
  const isDialogVisible = ref();

  const favoriteItems = ref<any>(LocalStorage.getItem(STORAGE_KEYS.SITEFAVOURITES) || []);

  const dialogTitle = computed(() => {
    return translate(props.directory.directoryName, props.directory.meta, "directoryName");
  });

  const groupedArray = computed(() => {
    // Use the groupKey prop with a fallback to "directoryName"
    const key: GroupKeys = props.groupBykey as GroupKeys;
    return groupBy(
      props.directoryItemsList.filter(item => item[key] !== undefined),
      item => item[key] as string | number // Make sure the key exists on the item
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

  const tab = ref(tabItems.value[0].name);
  const setTab = (val: string) => (tab.value = val);

  onMounted(() => {
    eventBus.on("SiteListDialog", () => {
      isDialogVisible.value = false;
    });
  });

  function updateDialogState(status: any) {
    isDialogVisible.value = status;
    eventBus.emit("DialogStatus", status, "SiteListDialog");
  }

  function onItemClick(item: any) {
    $q.dialog({
      component: defineAsyncComponent(
        () => import("@/components/dialog/category-detail-dialog.vue")
      ),
      componentProps: {
        item: item as Site
      }
    });
  }
</script>
