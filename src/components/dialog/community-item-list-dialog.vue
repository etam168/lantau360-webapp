<template>
  <q-dialog
    ref="dialogRef"
    transition-show="slide-up"
    transition-hide="slide-down"
    @update:model-value="updateDialogState"
    :model-value="isDialogVisible"
    maximized
  >
    <q-layout view="lHh lpr lFr" container class="bg-white" style="max-width: 1024px">
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
                <app-community-item-list
                  @item-click="onItemClick"
                  :directoryItems="filterGroupedArray(item.name)"
                  :template="template"
                  :directory="props.directory as CommunityDirectory"
                />
              </q-tab-panel>
            </q-tab-panels>
          </template>

          <!-- `If groupBykey doesn't exist, show the linear app-category-item-list` -->

          <template v-else>
            <app-community-item-list
              class="q-px-md q-pt-md q-pb-none"
              @create-posting="createPosting"
              @item-click="onItemClick"
              :directoryItems="directoryItems"
              :template="template"
              :directory="props.directory as CommunityDirectory"
              style="position: relative"
            />
          </template>

          <!-- <q-page-sticky position="bottom-right" :offset="[24, 24]">
            <q-btn round color="primary" icon="add" @click="createPosting" />
          </q-page-sticky> -->
        </q-page>
      </q-page-container>
    </q-layout>
  </q-dialog>
</template>

<script setup lang="ts">
  // interface files
  import { CommunityDirectory } from "@/interfaces/models/entities/community-directory";
  import { CategoryTypes } from "@/interfaces/types/category-types";
  import { DirectoryTypes } from "@/interfaces/types/directory-types";
  import { TabItem } from "@/interfaces/tab-item";

  // others import
  import { useDialogPluginComponent, useQuasar } from "quasar";
  import { NONE, AREA_NAME, POST_POINTS } from "@/constants";
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
  const { groupBy, translate, translateAlt, eventBus } = useUtilities();
  const userStore = useUserStore();
  const $q = useQuasar();
  const isDialogVisible = ref();

  const directoryItems = ref<CategoryTypes[]>(props?.directoryItemsList ?? []);

  const dialogTitle = computed(() => {
    const { directoryName, directoryNameAlt } = props.directory as CommunityDirectory;

    // Check if directoryNameAlt exists and is not null
    if (directoryNameAlt !== undefined && directoryNameAlt !== null) {
      return translateAlt(directoryName, directoryNameAlt, "directoryName");
    } else {
      return translate(directoryName, props.directory.meta, "directoryName");
    }
  });

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

  function updateDialogState(status: boolean) {
    isDialogVisible.value = status;
    eventBus.emit("DialogStatus", status, "CategoryItemListDialog");
  }

  function onItemClick(item: CategoryTypes) {
    const directory = props.directory;
    $q.dialog({
      component: defineAsyncComponent(
        () => import("@/components/dialog/community-detail-dialog.vue")
      ),
      componentProps: {
        item: item,
        directory: directory
      }
    });
  }

  function createPosting() {
    if (!userStore.isUserLogon()) {
      // User is not logged in, open the login dialog
      $q.dialog({
        component: defineAsyncComponent(
          () => import("@/views/modules/community/login-alert-dialog.vue")
        )
      });

      return;
    }

    // Check whether user have required point to create post
    if (userStore.availabelPoints < POST_POINTS) {
      $q.dialog({
        component: defineAsyncComponent(() => import("@/views/modules/community/alert-dialog.vue"))
      });
      return;
    }

    // User is logged in and also have required points to create new post
    $q.dialog({
      component: defineAsyncComponent(
        () => import("@/views/modules/community/input-dialog/index.vue")
      ),
      componentProps: {
        item: props.directory as CommunityDirectory
      }
    });
  }
</script>
