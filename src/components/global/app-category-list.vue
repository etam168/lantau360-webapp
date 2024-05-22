<template>
  <!-- Check if groupBykey exists -->
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
        <app-category-list-items
          :directoryItems="filterGroupedArray(item.name)"
          :directoryCheckIns="directoryCheckIns"
          :directory="directory"
        />
      </q-tab-panel>
    </q-tab-panels>
  </template>

  <!-- If groupBykey doesn't exist, show the linear app-category-item-list -->
  <template v-else>
    <app-category-list-items
      class="q-px-md q-pt-md q-pb-none"
      :directoryItems="directoryItems"
      :directory="directory"
      :directoryCheckIns="directoryCheckIns"
      style="position: relative"
    />
  </template>
</template>

<script setup lang="ts">
  // interface files
  import { CategoryTypes } from "@/interfaces/types/category-types";
  import { CheckIn } from "@/interfaces/models/entities/checkin";
  import { DirectoryTypes } from "@/interfaces/types/directory-types";
  import { TabItem } from "@/interfaces/tab-item";

  // others import
  import { useQuasar } from "quasar";
  import { NONE, AREA_NAME } from "@/constants";
  import { useUserStore } from "@/stores/user";

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

  const { t } = useI18n({ useScope: "global" });
  const { groupBy, isCommunityDirectory, translate, sortDirectoryItems } = useUtilities();
  const $q = useQuasar();
  const userStore = useUserStore();

  const directoryItems = ref<any>(props?.directoryItemsList ?? []);
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
      const myItems = directoryItems.value.filter(
        (item: any) => item.memberId === userStore.userId
      );
      return [
        { group: "allDirectory", items: directoryItems.value },
        { group: "myDirectory", items: myItems }
      ];
    } else {
      const key = groupBykey.value as keyof CategoryTypes;
      return groupBy(
        directoryItems.value.filter((item: any) => item[key] !== undefined),
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
    // Map over the groupedArray to create tabItems
    if (isCommunityDirectoryItem.value) {
      return [
        {
          name: "allDirectory",
          label: t("community.tabItems.allDirectory", { directory: props.directory.directoryName })
        },
        {
          name: "myDirectory",
          label: t("community.tabItems.myDirectory", { directory: props.directory.directoryName })
        }
      ];
    } else {
      return groupedArray.value.map(group => ({
        name: group.group,
        label: group.group
      })) as TabItem[];
    }
  });

  const tab = ref(tabItems.value.length > 0 ? tabItems.value[0].name : "");
  const setTab = (val: string) => (tab.value = val);

  // Function to filter groupedArray by group name
  function filterGroupedArray(groupName: string) {
    const items = groupedArray.value.filter(group => group.group === groupName).pop()?.items || [];
    return items.sort((a: any, b: any) => a.rank - b.rank);
  }

  onMounted(() => {
    //Sort Directory items
    const hasSortByKey = props.directory.meta.sortByKey in directoryItems.value[0];
    directoryItems.value = sortDirectoryItems(
      directoryItems.value,
      props.directory.meta.sortByKey,
      hasSortByKey
    );
  });
</script>
