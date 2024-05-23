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
          <create-posting-card
            v-if="isCommunityDirectoryItem"
            class="q-px-md q-pt-md q-pb-none"
            :directory="directory"
          />

          <template v-if="groupBykey">
            <app-tab-select
              :tab-items="tabItems"
              :current-tab="tab"
              @update:currentTab="setTab"
              :style="$q.screen.lt.sm ? 'flex-wrap: wrap' : ''"
              :class="$q.screen.lt.sm ? 'q-pt-sm' : ''"
            />

            <q-tab-panels v-model="tab">
              <q-tab-panel v-for="(item, index) in tabItems" :key="index" :name="item.name">
                <!-- Pass filterGroupedArray(item.name) if groupBykey exists -->
                <category-list-items
                  :directoryItems="filterGroupedArray(item.name)"
                  :directoryCheckIns="directoryCheckIns"
                  :directory="directory"
                />
              </q-tab-panel>
            </q-tab-panels>
          </template>

          <!-- If groupBykey doesn't exist, show the linear app-category-item-list -->
          <template v-else>
            <category-list-items
              class="q-px-md q-pt-md q-pb-none"
              :directoryItems="directoryItemsList"
              :directory="directory"
              :directoryCheckIns="directoryCheckIns"
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
  import { CheckIn } from "@/interfaces/models/entities/checkin";
  import { DirectoryTypes } from "@/interfaces/types/directory-types";
  import { TabItem } from "@/interfaces/tab-item";

  // others import
  import { useDialogPluginComponent } from "quasar";
  import { NONE, AREA_NAME } from "@/constants";
  import { useUserStore } from "@/stores/user";

  // Components
  import CreatePostingCard from "@/components/card/create-posting-card.vue";
  import CategoryListItems from "@/components/dialog/renderer/category-list-items.vue";
  import { PostingView } from "@/interfaces/models/views/posting-view";

  const props = defineProps({
    directoryItemsList: {
      type: Array as PropType<CategoryTypes[]>,
      required: true
    },
    directory: {
      type: Object as PropType<DirectoryTypes>,
      required: true
    },
    directoryCheckIns: {
      type: Array as PropType<CheckIn[]>,
      required: true
    }
  });
  const userStore = useUserStore();
  const { dialogRef } = useDialogPluginComponent();
  const { groupBy, isCommunityDirectory, translate, eventBus } = useUtilities();

  // const directoryItems = ref<any>(props?.directoryItemsList ?? []);
  const isDialogVisible = ref();

  const dialogTitle = computed(() =>
    translate(props.directory.directoryName, props.directory.meta, "directoryName")
  );

  const isCommunityDirectoryItem = computed(() => isCommunityDirectory(props.directory));

  const groupBykey = computed(() =>
    isCommunityDirectoryItem.value
      ? "memberId"
      : props.directory.meta?.groupByKey !== NONE
        ? props.directory.meta?.groupByKey
        : null
  );

  const groupedArray = computed(() => {
    if (isCommunityDirectoryItem.value) {
      return [
        { group: "All " + props.directory.directoryName, items: props.directoryItemsList },
        {
          group: "My " + props.directory.directoryName,
          items: (props.directoryItemsList as PostingView[]).filter(
            item => item.memberId === userStore.userId
          )
        }
      ];
    } else {
      const key = groupBykey.value as keyof CategoryTypes;
      return groupBy(
        props.directoryItemsList.filter((item: any) => item[key] !== undefined),
        (item: any) =>
          translate(
            item[key],
            groupBykey.value == AREA_NAME ? item.areaNameAlt : item.meta,
            key
          ) as string | number
      );
    }
  });

  // Define tabItems as a computed property
  const tabItems = computed(() => {
    return groupedArray.value.map(group => ({
      name: group.group,
      label: group.group
    })) as TabItem[];
  });

  const tab = ref(tabItems.value.length > 0 ? tabItems.value[0].name : "");
  const setTab = (val: string) => (tab.value = val);

  // Function to filter groupedArray by group name
  function filterGroupedArray(groupName: string) {
    const items = groupedArray.value.filter(group => group.group === groupName).pop()?.items || [];
    return items.sort((a: any, b: any) => a.rank - b.rank);
  }

  onMounted(() => {
    eventBus.on("CategoryItemListDialog", () => {
      isDialogVisible.value = false;
    });
  });

  function updateDialogState(status: boolean) {
    isDialogVisible.value = status;
    eventBus.emit("DialogStatus", status, "CategoryItemListDialog");
  }
</script>
