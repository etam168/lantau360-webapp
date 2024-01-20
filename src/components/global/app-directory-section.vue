<template>
  <div class="row q-gutter-y-md">
    <app-directory-item
      v-for="(item, index) in data"
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
  import { DirectoryTypes } from "@/interfaces/types/directory-types";

  // .ts file
  import { DIRECTORY_GROUPS, URL } from "@/constants";

  const props = defineProps({
    data: {
      type: Object as PropType<DirectoryTypes[]>,
      required: true
    }
  });

  const $q = useQuasar();
  const { eventBus } = useUtilities();
  const router = useRouter();

  const items = ref(props.data);

  items.value.sort((a, b) =>
    a.directoryName.localeCompare(b.directoryName, undefined, { sensitivity: "base" })
  );

  const handleDialog = async (item: DirectoryTypes) => {
    try {
      const directoryListUrl = (() => {
        switch (true) {
          case "communityDirectoryId" in item:
            return `${URL.DIRECTORY_LIST.POSTING}/${item.communityDirectoryId}`;
          case "groupId" in item && DIRECTORY_GROUPS.HOME.includes(item.groupId):
            return `${URL.DIRECTORY_LIST.SITE}/${item.directoryId}`;
          case "groupId" in item && DIRECTORY_GROUPS.BUSINESS.includes(item.groupId):
            return `${URL.DIRECTORY_LIST.BUSINESS}/${item.directoryId}`;
          default:
            throw new Error("Unknown directory type");
        }
      })();

      const response = await axios.get(directoryListUrl);
      if (response.status === 200) {
        // let directoryItems = null;
        const sortByKey = item.meta.sortByKey;
        // directoryItems = useSorted(
        //   response.data,
        //   (a, b) =>
        //     a.rank - b.rank ||
        //     a[sortByKey].localeCompare(b[sortByKey], undefined, { sensitivity: "base" })
        // );

        const directoryItems = useSorted(response.data, (a, b) => {
          const rankingDifference = a.rank - b.rank;

          // Check if sortByKey exists in the first object
          const hasSortByKey = sortByKey in response.data[0];

          // If sortByKey exists, use it for comparison
          if (hasSortByKey) {
            return rankingDifference || String(a[sortByKey]).localeCompare(String(b[sortByKey]));
          }

          // If sortByKey doesn't exist, fall back to ranking difference
          return rankingDifference;
        });

        const createCommunityDialog = (item: DirectoryTypes) => {
          $q.dialog({
            component: defineAsyncComponent(
              () => import("@/components/dialog/community-item-list-dialog.vue")
            ),
            componentProps: {
              directoryItemsList: directoryItems,
              directory: item
              // groupBykey: groupBy
            }
          });
        };

        const createCategoryDialog = (item: DirectoryTypes) => {
          $q.dialog({
            component: defineAsyncComponent(
              () => import("@/components/dialog/category-item-list-dialog.vue")
            ),
            componentProps: {
              directoryItemsList: directoryItems,
              directory: item
              // groupBykey: groupBy
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

  // Throttle the handleDialog function
  const throttledHandleDialog = throttle(handleDialog, 2000);

  eventBus.on("navigateToMore", () => {
    // Navigate to "/more" when the event is received
    router.push("/more");
  });
</script>
