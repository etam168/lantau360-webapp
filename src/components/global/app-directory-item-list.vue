<template>
  <div class="row q-gutter-y-md">
    <q-card
      flat
      v-for="(item, index) in sortedData"
      :key="index"
      class="text-center"
      :class="['text-center', { 'col-4': $q.screen.lt.sm, 'col-3': !$q.screen.lt.sm }]"
      @click="handleDialog(item)"
    >
      <q-item class="items-center justify-center">
        <q-item-section avatar class="items-center q-pa-none">
          <q-avatar size="64px" style="background: #e9f8e8">
            <q-img :src="getImageURL(item.imagePath)" />
          </q-avatar>

          <q-item-label class="text-center q-ma-sm">{{ getDirectoryTitle(item) }}</q-item-label>
        </q-item-section>
      </q-item>
    </q-card>
  </div>
</template>

<script setup lang="ts">
  // Quasar Import
  import { useQuasar } from "quasar";

  // interface files
  import { CheckIn } from "@/interfaces/models/entities/checkin";
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

  const { eventBus, isCommunityDirectory, isDirectory, getImageURL, translate, translateAlt } =
    useUtilities();
  const { isUserLogon, userId } = useUserStore();

  const $q = useQuasar();
  const router = useRouter();

  const isDialogOpen = ref(false);

  function getDirectoryTitle(item: DirectoryTypes) {
    const { shortName, shortNameAlt } = item;

    // Check if directoryNameAlt exists and is not null
    if (shortNameAlt !== undefined && shortNameAlt !== null) {
      return translateAlt(shortName, shortNameAlt, "shortName");
    } else {
      return translate(shortName, item.meta, "shortName");
    }
  }
  // Computed property for sorted data that does not mutate props
  const sortedData = computed(() => {
    const temp = [...props.data];
    const key = "directoryName";
    return temp.sort((a, b) => {
      if (a.rank !== b.rank) return a.rank - b.rank;

      const directoryA = translate(a.directoryName, a.meta, key);
      const directoryB = translate(b.directoryName, b.meta, key);
      return directoryA.localeCompare(directoryB, undefined, { sensitivity: "base" });
    });
  });

  const handleDialog = async (item: DirectoryTypes) => {
    if (isDialogOpen.value) return;

    isDialogOpen.value = true;
    const requestUrls = [];

    if (isCommunityDirectory(item)) {
      requestUrls.push(`${URL.DIRECTORY_LIST.POSTING}/${item.communityDirectoryId}`);
    } else if (isDirectory(item) && DIRECTORY_GROUPS.HOME.includes(item.groupId)) {
      requestUrls.push(`${URL.DIRECTORY_LIST.SITE}/${item.directoryId}`);
      if (isUserLogon())
        requestUrls.push(
          `${URL.MEMBER_DIRECTORY_CHECK_IN}?memberId=${userId}&directoryId=${item.directoryId}`
        );
    } else if (isDirectory(item) && DIRECTORY_GROUPS.BUSINESS.includes(item.groupId)) {
      requestUrls.push(`${URL.DIRECTORY_LIST.BUSINESS}/${item.directoryId}`);
    }

    try {
      const axiosRequests = requestUrls.map(url => axios.get(url));
      const responses = await Promise.all(axiosRequests);

      const directoryResponse = responses[0];
      if (directoryResponse.status === 200) {
        const directoryData = directoryResponse.data;
        const checkInData = responses[1] ? responses[1].data : [];
        CategoryDialog(item, directoryData, checkInData);
      }
    } catch (error) {
      console.error("Error fetching data: ", error);
    }
  };

  function closeDialog() {
    isDialogOpen.value = false;
  }

  function CategoryDialog(dir: DirectoryTypes, itemList: CategoryTypes[], checkIn: CheckIn[]) {
    $q.dialog({
      component: defineAsyncComponent(
        () => import("@/components/dialog/category-item-list-dialog.vue")
      ),
      componentProps: {
        directoryItemsList: itemList,
        directory: dir,
        directoryCheckIns: checkIn
      }
    })
      .onCancel(closeDialog)
      .onOk(closeDialog)
      .onDismiss(closeDialog);
  }

  onMounted(() => {
    eventBus.on("navigateToMore", () => {
      // Navigate to "/more" when the event is received
      router.push("/more");
    });
  });
</script>

<style scoped></style>
