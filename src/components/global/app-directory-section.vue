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

  // .ts file
  import { DIRECTORY_GROUPS, URL } from "@/constants";
  import { useUserStore } from "@/stores/user";
  import { CategoryTypes } from "@/interfaces/types/category-types";

  const props = defineProps({
    data: {
      type: Object as PropType<DirectoryTypes[]>,
      required: true
    }
  });

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
      let responseData;
      let directoryCheckInResponse;
      if (isUserLogon() && isDirectory(item) && DIRECTORY_GROUPS.HOME.includes(item.groupId)) {
        const [response, directoryCheckIn] = await Promise.all([
          axios.get<CategoryTypes[]>(directoryListUrl),
          axios.get<CheckIn[]>(
            `${URL.MEMBER_DIRECTORY_CHECK_IN}?memberId=${userId}&directoryId=${(item as Directory).directoryId}`
          )
        ]);
        responseData = response;
        directoryCheckInResponse = directoryCheckIn;
      } else {
        const response = await axios.get<CategoryTypes[]>(directoryListUrl);
        responseData = response;
      }

      if (responseData.status === 200) {
        // Call the throttled functions to create the dialogs
        if (isCommunityDirectory(item)) {
          throttledCreateCommunityDialog(item, responseData.data);
        } else {
          throttledCreateCategoryDialog(
            item,
            responseData.data,
            directoryCheckInResponse?.data ?? []
          );
        }
      }
    } catch (error) {
      // console.error("Error fetching data: ", error);
    }
  };

  const createCommunityDialog = (item: DirectoryTypes, itemList: CategoryTypes[]) => {
    $q.dialog({
      component: defineAsyncComponent(
        () => import("@/components/dialog/community-item-list-dialog.vue")
      ),
      componentProps: {
        directoryItemsList: itemList,
        directory: item
        // groupBykey: groupBy
      }
    });
  };

  const createCategoryDialog = (
    item: DirectoryTypes,
    itemList: CategoryTypes[],
    directoryCheckIn: CheckIn[]
  ) => {
    $q.dialog({
      component: defineAsyncComponent(
        () => import("@/components/dialog/category-item-list-dialog.vue")
      ),
      componentProps: {
        directoryItemsList: itemList,
        directory: item,
        directoryCheckIns: directoryCheckIn
      }
    });
  };

  const throttledCreateCommunityDialog = throttle(createCommunityDialog, 2000);
  const throttledCreateCategoryDialog = throttle(createCategoryDialog, 2000);

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
  // Throttle the handleDialog function
  const throttledHandleDialog = throttle(handleDialog, 2000);

  onMounted(() => {
    eventBus.on("navigateToMore", () => {
      // Navigate to "/more" when the event is received
      router.push("/more");
    });
  });
</script>
