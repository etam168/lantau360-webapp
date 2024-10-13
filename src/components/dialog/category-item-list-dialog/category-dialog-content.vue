<template>
  <<q-card>
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
        <q-tab-panel
          v-for="(item, index) in tabItems"
          :key="index"
          :name="item.name"
          class="q-pa-none"
        >
          <category-list-items
            :directoryItems="filterGroupedArray(item.name)"
            :directoryCheckIns="directoryCheckIns"
            :directory="directory"
          />
        </q-tab-panel>
      </q-tab-panels>
    </template>

    <template v-else>
      <category-list-items :directoryItems="directoryItemsList" :directory :directoryCheckIns />
    </template>
    <!-- <category-list-items :directoryItems="directoryItemsList" :directory :directoryCheckIns /> -->
  </q-card>
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
    const { api , fetchData} = useApi();

    // Components
    import CreatePostingCard from "@/components/card/create-posting-card.vue";
    import CategoryListItems from "@/components/dialog/list-items/category-list-items/index.vue";
    import { PostingView } from "@/interfaces/models/views/posting-view";

    import { EntityURLKey } from "@/constants/app/entity-url";
    import { URL } from "@/constants";


    // // Props
    // const {
    //   directoryItemsList,
    //   directory,
    //   directoryCheckIns = []
    // } = defineProps<{
    //   directoryItemsList: CategoryTypes[];
    //   directory: DirectoryTypes;
    //   directoryCheckIns?: CheckIn[];
    // }>();

    // Props
    const { row, entityKey } = defineProps<{
      row: DirectoryTypes;
      entityKey: EntityURLKey;
    }>();

  const { isUserLogon, userId } = useUserStore();

    const { dialogRef } = useDialogPluginComponent();
    const { groupBy, isCommunityDirectory, translate, eventBus } = useUtilities();

    const isDialogVisible = ref();

    const directoryItemsList = ref<CategoryTypes[]>([]);
    const directory = ref<DirectoryTypes>(row);
    const directoryCheckIns = ref<CheckIn[]>([]);

    const dialogTitle = computed(() =>
      translate(directory.value.directoryName, directory.value.meta, "directoryName")
    );

    const isCommunityDirectoryItem = computed(() => isCommunityDirectory(directory.value));

    const groupBykey = computed(() =>
      isCommunityDirectoryItem.value
        ? "memberId"
        : directory.value.meta?.groupByKey !== NONE
          ? directory.value.meta?.groupByKey
          : null
    );

    const groupedArray = computed(() => {
      if (isCommunityDirectoryItem.value) {
        return [
          { group: "All " + directory.value.directoryName, items: directoryItemsList },
          {
            group: "My " + directory.value.directoryName,
            items: (directoryItemsList.value as PostingView[]).filter(
              item => item.memberId === userId
            )
          }
        ];
      } else {
        const key = groupBykey.value as keyof CategoryTypes;
        return groupBy(
          directoryItemsList.value.filter((item: any) => item[key] !== undefined),
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

      /**
     * Fetches all required data concurrently
     * Populates the reactive variables with the fetched data
     */
     const fetchAllData = async () => {
      try {
        switch (entityKey) {
          case "SITE":
          await fetchSiteData();
          default:
            console.warn(`Unsupported entity type: ${entityKey}`);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        throw error;
      }
    };

  async function fetchSiteData()
  {
      const requestUrls = [];
      requestUrls.push(`${URL.DIRECTORY_LIST.SITE}/${directory.value.directoryId}`);
      if (isUserLogon())
        requestUrls.push(
          `${URL.MEMBER_DIRECTORY_CHECK_IN}?memberId=${userId}&directoryId=${directory.value.directoryId}`
        );

      try {
        const axiosRequests = requestUrls.map(url => api.get(url));
        const responses = await Promise.all(axiosRequests);

        const directoryResponse = responses[0];
        if (directoryResponse.status === 200) {
          const directoryData = directoryResponse.data;
          const checkInData = responses[1] ? responses[1].data : [];

          directoryItemsList.value = directoryData;
          directoryCheckIns.value =  checkInData;
        }
      }
      catch(ex: any)
      {

      }
    }

    /**
     * Fetch data as part of the setup
     * This ensures that the component is compatible with Suspense
     */
    await fetchAllData();
</script>
