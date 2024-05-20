<template>
  <!-- <pre>{{ data }}</pre> -->
  <div class="row q-gutter-y-md">
    <app-directory-item
      v-for="(item, index) in sortedData"
      :key="index"
      :item="item"
      :class="{ 'col-4': $q.screen.lt.sm, 'col-3': !$q.screen.lt.sm }"
      @on-click="throttledHandleDialog"
    />
  </div>
</template>

<script setup lang="ts">
  // Quasar Import
  import { throttle, useQuasar } from "quasar";

  // interface files
  import { CheckIn } from "@/interfaces/models/entities/checkin";
  import { Directory } from "@/interfaces/models/entities/directory";
  import { DirectoryTypes } from "@/interfaces/types/directory-types";
  // import {isCommunityDirectoty}

  // .ts file
  import { DIRECTORY_GROUPS, URL } from "@/constants";
  import { useUserStore } from "@/stores/user";

  const props = defineProps({
    data: {
      type: Object as PropType<DirectoryTypes[]>,
      required: true
    }
  });

  const { locale } = useI18n();
  const { eventBus, isCommunityDirectory, isDirectory, translate } = useUtilities();
  const { isUserLogon, userId } = useUserStore();

  const $q = useQuasar();
  const router = useRouter();

  // Computed property for sorted data that does not mutate props
  const sortedData = computed(() => {
    const temp = [...props.data];
    const key = "directoryName";
    return temp.sort((a, b) => {
      if (a.rank !== b.rank) {
        return a.rank - b.rank;
      }
      const directoryA = translate(a.directoryName, a.meta, key);
      const directoryB = translate(b.directoryName, b.meta, key);
      return directoryA.localeCompare(directoryB, undefined, { sensitivity: "base" });
    });
  });

  const handleDialog = async (item: DirectoryTypes) => {
    const directoryListUrl = getDirectoryListUrl(item);
    try {
      const response = await axios.get(directoryListUrl);

      if (response.status === 200) {
        // let directoryItems = null;
        const sortByKey = item.meta.sortByKey;
        const directoryItems = useSorted(response.data, (a, b) => {
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

        const createCommunityDialog = (item: DirectoryTypes) => {
          $q.dialog({
            component: defineAsyncComponent(
              () => import("@/components/dialog/community-item-list-dialog.vue")
            ),
            componentProps: {
              directoryItemsList: directoryItems.value,
              directory: item
              // groupBykey: groupBy
            }
          });
        };

        const createCategoryDialog = async (item: DirectoryTypes) => {
          const directoryCheckIn = await getMemberDirectoryCheckIn((item as Directory).directoryId);

          $q.dialog({
            component: defineAsyncComponent(
              () => import("@/components/dialog/category-item-list-dialog.vue")
            ),
            componentProps: {
              directoryItemsList: directoryItems.value,
              directory: item,
              directoryCheckIns: directoryCheckIn
            }
          });
        };

        // Throttle the createDialog functions
        const throttledCreateCommunityDialog = throttle(createCommunityDialog, 2000);
        const throttledCreateCategoryDialog = throttle(createCategoryDialog, 2000);

        // Call the throttled functions to create the dialogs
        if ("communityDirectoryId" in item) {
          throttledCreateCommunityDialog(item);
        } else {
          throttledCreateCategoryDialog(item);
        }
      }
    } catch (error) {
      // console.error("Error fetching data: ", error);
    }
  };

  function getDirectoryListUrl(item: DirectoryTypes) {
    switch (true) {
      case isCommunityDirectory(item):
        return `${URL.DIRECTORY_LIST.POSTING}/${item.communityDirectoryId}`;
      case isDirectory(item) && DIRECTORY_GROUPS.HOME.includes(item.groupId):
        return `${URL.DIRECTORY_LIST.SITE}/${item.directoryId}`;
      case isDirectory(item):
        return `${URL.DIRECTORY_LIST.BUSINESS}/${item.directoryId}`;
      default:
        return "";
    }
  }

  async function getMemberDirectoryCheckIn(directoryId: number): Promise<Array<CheckIn>> {
    const isLogon = isUserLogon();

    if (!isLogon) return [] as CheckIn[];
    const response = await axios.get(
      `${URL.MEMBER_DIRECTORY_CHECK_IN}?memberId=${userId}&directoryId=${directoryId}`
    );
    return response.status == 200 ? response.data : [];
  }

  // Throttle the handleDialog function
  const throttledHandleDialog = throttle(handleDialog, 2000);

  eventBus.on("navigateToMore", () => {
    // Navigate to "/more" when the event is received
    router.push("/more");
  });
</script>
